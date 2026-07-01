from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from inquiries.models import (
    ContactMessage,
    ProductInquiry,
)

from inquiries.serializers.inquiry import (
    ContactMessageSerializer,
    ProductInquirySerializer,
)

from common.permissions import IsAdmin

from django.core.mail import send_mail
from django.conf import settings
from rest_framework.throttling import ScopedRateThrottle


class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def perform_create(self, serializer):
        inquiry = serializer.save()

        send_mail(
            subject=f'New Contact Inquiry: {inquiry.subject}',
            message=inquiry.message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_NOTIFY_EMAIL],
            fail_silently=True,
        )
        
        
class ProductInquiryCreateView(generics.CreateAPIView):
    serializer_class = ProductInquirySerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"


class AdminContactMessageListView(generics.ListAPIView):
    serializer_class = ContactMessageSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    queryset = ContactMessage.objects.all().order_by(
        '-created_at'
    )


class AdminProductInquiryListView(generics.ListAPIView):
    serializer_class = ProductInquirySerializer

    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    queryset = ProductInquiry.objects.all().order_by(
        '-created_at'
    )
