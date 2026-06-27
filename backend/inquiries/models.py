from django.db import models

from common.models import BaseModel
from products.models import Product


class ContactSubject(models.TextChoices):
    GENERAL = 'General', 'General'
    SALES = 'Sales', 'Sales'
    SUPPORT = 'Support', 'Support'
    PARTNERSHIP = 'Partnership', 'Partnership'


class ContactMessage(BaseModel):
    name = models.CharField(max_length=100)

    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    email = models.EmailField()

    subject = models.CharField(
        max_length=50,
        choices=ContactSubject.choices
    )

    message = models.TextField()

    handled = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ProductInquiry(BaseModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='inquiries'
    )

    name = models.CharField(max_length=100)

    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    email = models.EmailField()

    message = models.TextField(
        blank=True,
        null=True
    )

    handled = models.BooleanField(default=False)

    def __str__(self):
        return self.name