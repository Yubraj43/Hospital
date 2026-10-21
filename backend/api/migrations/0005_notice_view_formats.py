from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_patientreview_contact_details"),
    ]

    operations = [
        migrations.AddField(
            model_name="notice",
            name="image_attachment",
            field=models.FileField(
                blank=True,
                upload_to="notices/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["jpg", "jpeg"],
                    ),
                ],
            ),
        ),
        migrations.AddField(
            model_name="notice",
            name="pdf_attachment",
            field=models.FileField(
                blank=True,
                upload_to="notices/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["pdf"],
                    ),
                ],
            ),
        ),
    ]
