from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        from django.contrib import admin

        admin.site.site_header = "Sirjana Advanced Polyclinic"
        admin.site.site_title = "Sirjana Advanced Polyclinic Admin"
        admin.site.index_title = "Clinic Management"
