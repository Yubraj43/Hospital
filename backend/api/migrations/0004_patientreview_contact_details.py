from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_patientreview"),
    ]

    operations = [
        migrations.AddField(
            model_name="patientreview",
            name="email",
            field=models.EmailField(default="", max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="patientreview",
            name="phone_number",
            field=models.CharField(default="", max_length=20),
            preserve_default=False,
        ),
    ]
