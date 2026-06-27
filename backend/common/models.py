import uuid

from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class MediaAsset(BaseModel):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="media-library/")
    alt_text = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title


class SiteSetting(BaseModel):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    label = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.label or self.key


class VisitCount(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    count = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"{self.name}: {self.count}"
