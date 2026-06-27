from django.db import models
from autoslug import AutoSlugField

from common.models import BaseModel
from accounts.models import User


class BlogCategory(models.TextChoices):
    MAIZE = 'Maize', 'Maize'
    TOMATO = 'Tomato', 'Tomato'
    COFFEE = 'Coffee', 'Coffee'
    BEANS = 'Beans', 'Beans'
    GENERAL = 'General', 'General'


class Post(BaseModel):
    title_en = models.CharField(max_length=255)

    title_sw = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    slug = AutoSlugField(
        populate_from='title_en',
        unique=True,
        always_update=False
    )

    category = models.CharField(
        max_length=50,
        choices=BlogCategory.choices,
        default=BlogCategory.GENERAL
    )

    excerpt_en = models.TextField(
        blank=True,
        null=True
    )

    excerpt_sw = models.TextField(
        blank=True,
        null=True
    )

    body_en = models.TextField()

    body_sw = models.TextField(
        blank=True,
        null=True
    )

    cover_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True
    )

    is_published = models.BooleanField(default=False)

    published_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title_en