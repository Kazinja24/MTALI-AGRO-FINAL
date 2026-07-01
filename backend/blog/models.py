from django.db import models
from django.core.exceptions import ValidationError
from autoslug import AutoSlugField

from accounts.models import User
from common.models import BaseModel
from common.text import sanitize_text


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

    def clean(self):
        self.title_en = sanitize_text(
            self.title_en,
            collapse_whitespace=True,
            allow_blank=False,
        ) or ""
        if not self.title_en:
            raise ValidationError({"title_en": "Title cannot be empty after sanitization."})

        self.title_sw = sanitize_text(
            self.title_sw,
            collapse_whitespace=True,
        )
        self.excerpt_en = sanitize_text(self.excerpt_en)
        self.excerpt_sw = sanitize_text(self.excerpt_sw)
        self.body_en = sanitize_text(
            self.body_en,
            allow_blank=False,
        ) or ""
        if not self.body_en:
            raise ValidationError({"body_en": "Body cannot be empty after sanitization."})

        self.body_sw = sanitize_text(self.body_sw)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title_en
