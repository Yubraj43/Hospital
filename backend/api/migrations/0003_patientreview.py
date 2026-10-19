from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_emergencycontactsettings"),
    ]

    operations = [
        migrations.CreateModel(
            name="PatientReview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80)),
                ("rating", models.PositiveSmallIntegerField(choices=[(1, "1 star"), (2, "2 stars"), (3, "3 stars"), (4, "4 stars"), (5, "5 stars")])),
                ("review", models.CharField(max_length=700)),
                ("publication_consent", models.BooleanField(default=False)),
                ("is_published", models.BooleanField(db_index=True, default=False)),
                ("submitted_at", models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={
                "verbose_name": "patient review",
                "verbose_name_plural": "patient reviews",
                "ordering": ("-submitted_at",),
            },
        ),
    ]
