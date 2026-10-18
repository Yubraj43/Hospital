import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import Appointment, Doctor, EmergencyContactSettings, Facility, GalleryImage, Notice, Offer, Service
from .serializers import (
    AppointmentRequestSerializer,
    DoctorSerializer,
    EmergencyContactSettingsSerializer,
    FacilitySerializer,
    GalleryImageSerializer,
    NoticeSerializer,
    OfferSerializer,
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
        if not clinic_email or not settings.EMAIL_HOST:
            email_error = "The clinic recipient email and SMTP delivery settings have not been configured yet."
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
                # Keep SMTP diagnostics in the staff-only appointment record so
                # the clinic can identify configuration and provider errors.
                # The public API response below remains generic and never leaks
                # SMTP details to patients.
                email_error = f"SMTP delivery failed: {exc}"[:240]

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
