import json
import logging
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import Appointment, Doctor, EmergencyContactSettings, Facility, GalleryImage, Notice, Offer, PatientReview, Service
from .serializers import (
    AppointmentRequestSerializer,
    DoctorSerializer,
    EmergencyContactSettingsSerializer,
    FacilitySerializer,
    GalleryImageSerializer,
    NoticeSerializer,
    OfferSerializer,
    PatientReviewSerializer,
    ServiceSerializer,
)

logger = logging.getLogger(__name__)


class PublicListView(generics.ListAPIView):
    permission_classes = [AllowAny]


class DoctorListView(PublicListView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.filter(is_published=True)


class DoctorDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorSerializer
    lookup_field = "slug"
    queryset = Doctor.objects.filter(is_published=True)


class EmergencyContactSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        contact = EmergencyContactSettings.objects.first()
        if contact is None:
            return Response({"phone_number": ""})
        return Response(EmergencyContactSettingsSerializer(contact).data)


class ServiceListView(PublicListView):
    serializer_class = ServiceSerializer
    queryset = Service.objects.filter(is_published=True)


class FacilityListView(PublicListView):
    serializer_class = FacilitySerializer
    queryset = Facility.objects.filter(is_published=True)


class OfferListView(PublicListView):
    serializer_class = OfferSerializer

    def get_queryset(self):
        today = timezone.localdate()
        return Offer.objects.filter(is_published=True).filter(
            Q(starts_at__isnull=True) | Q(starts_at__lte=today),
            Q(expires_at__isnull=True) | Q(expires_at__gte=today),
        )


class NoticeListView(PublicListView):
    serializer_class = NoticeSerializer

    def get_queryset(self):
        today = timezone.localdate()
        return Notice.objects.filter(is_published=True, published_on__lte=today).filter(
            Q(expires_on__isnull=True) | Q(expires_on__gte=today)
        ).order_by("-published_on", "-created_at")


class FeaturedNoticeView(NoticeListView):
    def get_queryset(self):
        return super().get_queryset().filter(show_on_homepage=True)


class FirstVisitNoticeView(NoticeListView):
    def get_queryset(self):
        return super().get_queryset().filter(show_on_first_visit=True)


class GalleryListView(PublicListView):
    serializer_class = GalleryImageSerializer
    queryset = GalleryImage.objects.filter(is_published=True)


class PatientReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PatientReviewSerializer

    def get_queryset(self):
        return PatientReview.objects.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(is_published=False)


class AppointmentRateThrottle(AnonRateThrottle):
    scope = "appointments"


class AppointmentCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AppointmentRateThrottle]

    def post(self, request):
        serializer = AppointmentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()

        clinic_email = settings.APPOINTMENT_NOTIFICATION_EMAIL
        email_sent = False
        email_error = ""
        if not clinic_email:
            email_error = "The clinic recipient email has not been configured."
        else:
            doctor_name = appointment.doctor.name if appointment.doctor else "No doctor selected"
            subject = "New Appointment Request – Sirjana Advanced Polyclinic"
            body = "\n".join([
                "A new appointment request was submitted on the Sirjana Advanced Polyclinic website.",
                "",
                f"Patient name: {appointment.patient_name}",
                f"Phone: {appointment.phone}",
                f"Email: {appointment.email or 'Not provided'}",
                f"Age: {appointment.age if appointment.age is not None else 'Not provided'}",
                f"Gender: {appointment.gender or 'Not provided'}",
                f"Doctor: {doctor_name}",
                f"Preferred date: {appointment.appointment_date.isoformat()}",
                f"Preferred time: {appointment.preferred_time}",
                f"Reason: {appointment.reason or 'Not provided'}",
                "",
                "This is a request only. Please contact the patient to confirm availability.",
            ])
            if settings.RESEND_API_KEY:
                if not settings.RESEND_FROM_EMAIL:
                    email_error = "Set RESEND_FROM_EMAIL to a sender address verified with Resend."
                else:
                    payload = json.dumps({
                        "from": settings.RESEND_FROM_EMAIL,
                        "to": [clinic_email],
                        "subject": subject,
                        "text": body,
                    }).encode("utf-8")
                    api_request = Request(
                        "https://api.resend.com/emails",
                        data=payload,
                        headers={
                            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        method="POST",
                    )
                    try:
                        with urlopen(api_request, timeout=15) as response:
                            email_sent = response.status in (200, 201, 202)
                            if not email_sent:
                                email_error = f"Resend API returned HTTP {response.status}."
                    except HTTPError as exc:
                        detail = exc.read().decode("utf-8", errors="replace")
                        logger.warning(
                            "Resend rejected appointment email for request %s: %s",
                            appointment.pk,
                            detail,
                        )
                        email_error = f"Resend rejected the notification (HTTP {exc.code}): {detail}"[:240]
                    except (URLError, TimeoutError, OSError) as exc:
                        logger.exception("Resend request failed for appointment %s", appointment.pk)
                        email_error = f"Could not reach Resend API: {exc}"[:240]
            elif not settings.EMAIL_HOST:
                email_error = "Set RESEND_API_KEY or use SMTP on a Railway plan that permits SMTP."
            else:
                try:
                    sent_count = send_mail(
                        subject,
                        body,
                        settings.DEFAULT_FROM_EMAIL,
                        [clinic_email],
                        fail_silently=False,
                    )
                    email_sent = sent_count == 1
                    if not email_sent:
                        email_error = "The mail service did not accept the notification."
                except Exception as exc:
                    logger.exception("Appointment notification email failed for request %s", appointment.pk)
                    # Keep transport diagnostics staff-only; public responses do not expose them.
                    email_error = f"Email delivery failed: {exc}"[:240]

        appointment.email_sent = email_sent
        appointment.email_error = email_error
        appointment.save(update_fields=("email_sent", "email_error"))

        response_message = (
            "Your appointment request was received. The clinic will contact you to confirm a time."
            if email_sent
            else "Your request was saved, but the clinic email notification could not be sent. Please call the clinic to confirm receipt."
        )
        return Response({
            "id": appointment.pk,
            "received": True,
            "email_sent": email_sent,
            "message": response_message,
        }, status=status.HTTP_201_CREATED)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok"})
