from django.urls import path

from .views import (
    AppointmentCreateView,
    DoctorDetailView,
    DoctorListView,
    EmergencyContactSettingsView,
    FacilityListView,
    FeaturedNoticeView,
    FirstVisitNoticeView,
    GalleryListView,
    HealthCheckView,
    NoticeListView,
    OfferListView,
    ServiceListView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("doctors/", DoctorListView.as_view(), name="doctor-list"),
    path("doctors/<slug:slug>/", DoctorDetailView.as_view(), name="doctor-detail"),
    path("emergency-contact/", EmergencyContactSettingsView.as_view(), name="emergency-contact"),
    path("services/", ServiceListView.as_view(), name="service-list"),
    path("facilities/", FacilityListView.as_view(), name="facility-list"),
    path("offers/", OfferListView.as_view(), name="offer-list"),
    path("notices/", NoticeListView.as_view(), name="notice-list"),
    path("notices/featured/", FeaturedNoticeView.as_view(), name="featured-notice"),
    path("notices/first-visit/", FirstVisitNoticeView.as_view(), name="first-visit-notice"),
    path("gallery/", GalleryListView.as_view(), name="gallery-list"),
    path("appointments/", AppointmentCreateView.as_view(), name="appointment-create"),
]
