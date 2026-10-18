import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create a Django superuser using environment variables"

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

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"User '{username}' already exists. No changes made."
                )
            )
            return

        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Superuser '{user.username}' created successfully."
            )
        )
