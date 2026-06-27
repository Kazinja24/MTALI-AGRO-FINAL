from django.contrib import admin

from products.models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "featured",
        "active",
        "created_at",
    )

    list_filter = (
        "category",
        "featured",
        "active",
    )

    search_fields = (
        "name",
        "description",
    )

    filter_horizontal = ("crops",)
