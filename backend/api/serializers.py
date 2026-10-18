from django.utils import timezone
from datetime import datetime
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
    doctor = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Doctor.objects.filter(is_published=True),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Appointment
        fields = (
            "patient_name", "phone", "email", "age", "gender", "doctor",
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

    def validate_phone(self, value):
        cleaned = value.strip()
        digit_count = sum(character.isdigit() for character in cleaned)
        if digit_count < 7 or digit_count > 16:
            raise serializers.ValidationError("Enter a valid phone number.")
        return cleaned

    def validate_appointment_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Choose today or a future date.")
        return value

    def validate(self, attrs):
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
