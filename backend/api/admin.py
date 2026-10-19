from django.contrib import admin

from .models import Appointment, Doctor, EmergencyContactSettings, Facility, GalleryImage, Notice, Offer, PatientReview, Service


@admin.register(EmergencyContactSettings)
class EmergencyContactSettingsAdmin(admin.ModelAdmin):
    list_display = ("phone_number",)

    def has_add_permission(self, request):
        return not EmergencyContactSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "specialization", "is_published", "sort_order", "updated_at")
    list_filter = ("is_published", "specialization")
    search_fields = ("name", "specialization", "qualifications")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("sort_order", "name")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "is_published", "sort_order", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("sort_order", "name")


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ("name", "is_published", "sort_order", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("sort_order", "name")


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ("title", "offer_price", "starts_at", "expires_at", "is_published")
    list_filter = ("is_published", "starts_at", "expires_at")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("sort_order", "-created_at")


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "published_on", "expires_on", "show_on_homepage", "show_on_first_visit", "is_published")
    list_filter = ("is_published", "show_on_homepage", "show_on_first_visit", "published_on")
    search_fields = ("title", "summary")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("sort_order", "-published_on")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_published", "sort_order", "updated_at")
    list_filter = ("category", "is_published")
    search_fields = ("title", "description")
    ordering = ("sort_order", "-created_at")


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient_name", "phone", "doctor", "appointment_date", "preferred_time", "status", "email_sent", "created_at")
    list_filter = ("status", "appointment_date", "email_sent", "created_at")
    search_fields = ("patient_name", "phone", "email", "doctor__name")
    readonly_fields = ("created_at", "email_sent", "email_error")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)


@admin.register(PatientReview)
class PatientReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "review_preview", "is_published", "submitted_at")
    list_filter = ("is_published", "rating", "submitted_at")
    search_fields = ("name", "review")
    list_editable = ("is_published",)
    list_display_links = ("name",)
    readonly_fields = ("submitted_at",)
    ordering = ("-submitted_at",)
    fieldsets = (
        ("Patient review", {"fields": ("name", "rating", "review")}),
        ("Publication", {"fields": ("publication_consent", "is_published", "submitted_at")}),
    )

    @admin.display(description="Review")
    def review_preview(self, obj):
        return obj.review[:100] + ("…" if len(obj.review) > 100 else "")
