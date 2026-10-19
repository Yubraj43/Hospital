import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update the deployment superuser from environment variables"

    def handle(self, *args, **options):
        User = get_user_model()

        # Prefer Django-prefixed deployment settings, while keeping the
        # shorter names supported for existing Render configurations.
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME") or os.environ.get(
            "ADMIN_USERNAME"
        )
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL") or os.environ.get(
            "ADMIN_EMAIL", ""
        )
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD") or os.environ.get(
            "ADMIN_PASSWORD"
        )

        if not username or not password:
            raise CommandError(
                "Set DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD "
                "environment variables."
            )

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "is_staff": True, "is_superuser": True},
        )
        user.email = email or user.email
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Deployment superuser '{user.username}' {action} successfully."
            )
        )
