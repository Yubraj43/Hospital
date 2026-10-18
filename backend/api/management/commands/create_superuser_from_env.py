import os

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.password_validation import validate_password


class Command(BaseCommand):
    help = "Create a Django superuser from deployment environment variables, if absent."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")

        missing = [
            name
            for name, value in (
                ("DJANGO_SUPERUSER_USERNAME", username),
                ("DJANGO_SUPERUSER_EMAIL", email),
                ("DJANGO_SUPERUSER_PASSWORD", password),
            )
            if not value
        ]
        if missing:
            self.stdout.write("Admin setup skipped; no admin credentials were provided.")
            return

        User = get_user_model()
        username_field = User.USERNAME_FIELD
        existing = User._default_manager.filter(**{username_field: username}).first()
        if existing:
            if not existing.is_superuser:
                raise CommandError(
                    "That username already belongs to a non-admin account. Choose a different username."
                )
            self.stdout.write("This superuser already exists; no account or password was changed.")
            return

        user = User(**{username_field: username})
        try:
            validate_password(password, user=user)
        except ValidationError as exc:
            raise CommandError("The provided admin password does not meet the site's password rules.") from exc

        fields = {username_field: username, "password": password}
        if any(field.name == "email" for field in User._meta.get_fields()):
            fields["email"] = email
        User._default_manager.db_manager("default").create_superuser(**fields)
        self.stdout.write("Superuser created successfully.")
