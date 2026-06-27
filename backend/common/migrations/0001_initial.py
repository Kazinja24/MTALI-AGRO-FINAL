import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="MediaAsset",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200)),
                ("file", models.FileField(upload_to="media-library/")),
                ("alt_text", models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="SiteSetting",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("key", models.CharField(max_length=100, unique=True)),
                ("value", models.TextField(blank=True, null=True)),
                ("label", models.CharField(blank=True, max_length=200, null=True)),
            ],
            options={"abstract": False},
        ),
    ]
