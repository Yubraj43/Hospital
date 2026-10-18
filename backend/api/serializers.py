from django.utils import timezone
from datetime import datetime
import re
from rest_framework import serializers

from .models import Appointment, Doctor, EmergencyContactSettings, Facility, GalleryImage, Notice, Offer, Service


class EmergencyContactSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContactSettings
        fields = ("phone_number",)


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = (
            "id", "name", "slug", "photograph", "qualifications", "specialization",
            "years_experience", "consultation_fee", "available_days", "available_hours", "biography",
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("id", "name", "slug", "description", "image")


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ("id", "name", "slug", "description", "image")


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            "id", "title", "slug", "description", "image", "regular_price", "offer_price",
            "starts_at", "expires_at", "terms",
        )


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = (
            "id", "title", "slug", "summary", "attachment", "published_on", "expires_on",
            "show_on_homepage", "show_on_first_visit",
        )


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ("id", "title", "description", "image", "category")


class AppointmentRequestSerializer(serializers.ModelSerializer):
    country_code = serializers.CharField(write_only=True, required=False)
    doctor = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Doctor.objects.filter(is_published=True),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Appointment
        fields = (
            "patient_name", "phone", "country_code", "email", "age", "gender", "doctor",
            "appointment_date", "preferred_time", "reason",
        )
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
            "age": {"required": False, "allow_null": True},
            "gender": {"required": False, "allow_blank": True},
            "reason": {"required": False, "allow_blank": True},
        }

    def validate_patient_name(self, value):
        value = " ".join(value.split())
        if len(value) < 2:
            raise serializers.ValidationError("Please enter the patient's full name.")
        return value

    def validate_appointment_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Choose today or a future date.")
        return value

    def validate(self, attrs):
        # The public form sends country code and national number separately.
        # Accept the previous E.164-style payload during the frontend rollout.
        allowed_country_codes = ("+977", "+971", "+91", "+44", "+61", "+1")
        national_number = str(attrs.get("phone", "")).strip()
        country_code = attrs.pop("country_code", None)

        if country_code:
            if country_code not in allowed_country_codes:
                raise serializers.ValidationError({"country_code": "Choose a supported country code."})
        else:
            matched_code = next(
                (code for code in allowed_country_codes if national_number.startswith(code)),
                None,
            )
            if matched_code:
                country_code = matched_code
                national_number = national_number[len(matched_code):]
            else:
                country_code = "+977"

        if not re.fullmatch(r"[0-9]{7,10}", national_number):
            raise serializers.ValidationError({"phone": "Enter 7 to 10 digits only; letters are not allowed."})
        attrs["phone"] = f"{country_code}{national_number}"

        appointment_date = attrs.get("appointment_date")
        preferred_time = attrs.get("preferred_time", "")
        try:
            requested_time = datetime.strptime(preferred_time, "%H:%M").time()
        except (TypeError, ValueError) as error:
            raise serializers.ValidationError({"preferred_time": "Choose a valid appointment time."}) from error

        current_time = timezone.localtime()
        requested_datetime = timezone.make_aware(datetime.combine(appointment_date, requested_time))
        if requested_datetime <= current_time:
            raise serializers.ValidationError({"appointment_date": "Choose a future appointment date and time."})
        return attrs

    def validate_age(self, value):
        if value is not None and not 0 <= value <= 120:
            raise serializers.ValidationError("Enter an age between 0 and 120.")
        return value
