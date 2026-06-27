from django.urls import path

from inquiries.views.inquiry import (
    ContactMessageCreateView,
    ProductInquiryCreateView,
    AdminContactMessageListView,
    AdminProductInquiryListView,
)

urlpatterns = [
    path(
        'contact/',
        ContactMessageCreateView.as_view()
    ),

    path(
        'product/',
        ProductInquiryCreateView.as_view()
    ),

    path(
        'admin/contact/',
        AdminContactMessageListView.as_view()
    ),

    path(
        'admin/product/',
        AdminProductInquiryListView.as_view()
    ),
]