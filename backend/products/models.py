from django.db import models
from autoslug import AutoSlugField

from common.models import BaseModel
from crops.models import Crop
from accounts.models import User


class ProductCategory(models.TextChoices):
    FOLIAR = "Foliar", "Foliar"
    SOLUBLE = "Soluble", "Soluble"
    NUTRITION = "Nutrition", "Nutrition"


class Product(BaseModel):
    name = models.CharField(max_length=200)

    slug = AutoSlugField(populate_from="name", unique=True, always_update=False)

    category = models.CharField(max_length=50, choices=ProductCategory.choices)

    description = models.TextField(blank=True, null=True)

    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    currency = models.CharField(max_length=10, default="TZS")

    image = models.ImageField(upload_to="products/", blank=True, null=True)

    crops = models.ManyToManyField(Crop, related_name="products", blank=True)

    featured = models.BooleanField(default=False)

    active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return self.name
