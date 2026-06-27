from django.contrib import admin

from inquiries.models import (
    ContactMessage,
    ProductInquiry,
)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'subject',
        'handled',
        'created_at',
    )

    list_filter = (
        'subject',
        'handled',
    )

    search_fields = (
        'name',
        'email',
    )


@admin.register(ProductInquiry)
class ProductInquiryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'product',
        'handled',
        'created_at',
    )

    list_filter = (
        'handled',
    )

    search_fields = (
        'name',
        'email',
    )