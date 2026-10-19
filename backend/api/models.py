from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class PublishedContent(models.Model):
    is_published = models.BooleanField(default=False, db_index=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("sort_order", "-created_at")


class EmergencyContactSettings(models.Model):
    phone_number = models.CharField(
        max_length=32,
        default="+9779714548880",
        help_text="Number patients should call for urgent/emergency assistance.",
    )

    class Meta:
        verbose_name = "emergency contact"
        verbose_name_plural = "emergency contact"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Emergency contact: {self.phone_number}"


class Doctor(PublishedContent):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    photograph = models.ImageField(upload_to="doctors/", blank=True)
    qualifications = models.CharField(max_length=300, blank=True)
    specialization = models.CharField(max_length=160, blank=True)
    years_experience = models.PositiveSmallIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)
    available_days = models.CharField(max_length=160, blank=True, help_text="Example: Sunday–Friday")
    available_hours = models.CharField(max_length=160, blank=True, help_text="Example: 10:00 AM–4:00 PM")
    biography = models.TextField(blank=True)

    class Meta(PublishedContent.Meta):
        verbose_name = "doctor"
        verbose_name_plural = "doctors"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "doctor"
            slug = base_slug
            counter = 2
            while Doctor.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(PublishedContent):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="services/", blank=True)

    class Meta(PublishedContent.Meta):
        verbose_name_plural = "services"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "service"
            slug = base_slug
            counter = 2
            while Service.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Facility(PublishedContent):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="facilities/", blank=True)

    class Meta(PublishedContent.Meta):
        verbose_name_plural = "medical facilities"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "facility"
            slug = base_slug
            counter = 2
            while Facility.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Offer(PublishedContent):
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="offers/", blank=True)
    regular_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    starts_at = models.DateField(null=True, blank=True)
    expires_at = models.DateField(null=True, blank=True)
    terms = models.TextField(blank=True)

    class Meta(PublishedContent.Meta):
        verbose_name = "package or offer"
        verbose_name_plural = "packages and offers"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "offer"
            slug = base_slug
            counter = 2
            while Offer.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Notice(PublishedContent):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    summary = models.TextField(blank=True)
    attachment = models.FileField(upload_to="notices/", blank=True)
    published_on = models.DateField(default=timezone.localdate)
    expires_on = models.DateField(null=True, blank=True)
    show_on_homepage = models.BooleanField(default=False)
    show_on_first_visit = models.BooleanField(default=False)

    class Meta(PublishedContent.Meta):
        verbose_name_plural = "notices"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "notice"
            slug = base_slug
            counter = 2
            while Notice.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class GalleryImage(PublishedContent):
    CATEGORY_BUILDING = "building"
    CATEGORY_EQUIPMENT = "equipment"
    CATEGORY_DEPARTMENT = "department"
    CATEGORY_EVENT = "event"
    CATEGORY_CHOICES = [
        (CATEGORY_BUILDING, "Hospital building"),
        (CATEGORY_EQUIPMENT, "Equipment"),
        (CATEGORY_DEPARTMENT, "Departments"),
        (CATEGORY_EVENT, "Events"),
    ]

    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="gallery/")
    category = models.CharField(max_length=24, choices=CATEGORY_CHOICES, default=CATEGORY_BUILDING)

    class Meta(PublishedContent.Meta):
        verbose_name = "gallery image"
        verbose_name_plural = "gallery images"

    def __str__(self):
        return self.title


class Appointment(models.Model):
    STATUS_NEW = "new"
    STATUS_CONTACTED = "contacted"
    STATUS_BOOKED = "booked"
    STATUS_CLOSED = "closed"
    STATUS_CHOICES = [
        (STATUS_NEW, "New request"),
        (STATUS_CONTACTED, "Patient contacted"),
        (STATUS_BOOKED, "Appointment booked"),
        (STATUS_CLOSED, "Closed"),
    ]

    patient_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=32)
    email = models.EmailField(blank=True)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=40, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name="appointment_requests")
    appointment_date = models.DateField()
    preferred_time = models.CharField(max_length=80)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_NEW, db_index=True)
    email_sent = models.BooleanField(default=False)
    email_error = models.CharField(max_length=240, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "appointment request"
        verbose_name_plural = "appointment requests"

    def __str__(self):
        return f"{self.patient_name} — {self.appointment_date}"


class PatientReview(models.Model):
    name = models.CharField(max_length=80)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    rating = models.PositiveSmallIntegerField(choices=[(value, f"{value} star{'s' if value != 1 else ''}") for value in range(1, 6)])
    review = models.CharField(max_length=700)
    publication_consent = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False, db_index=True)
    submitted_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-submitted_at",)
        verbose_name = "patient review"
        verbose_name_plural = "patient reviews"

    def __str__(self):
        return f"{self.name} — {self.rating}/5"
