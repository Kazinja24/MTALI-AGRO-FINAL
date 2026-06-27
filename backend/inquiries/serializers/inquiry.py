from rest_framework import serializers

from inquiries.models import (
    ContactMessage,
    ProductInquiry,
)


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage

        fields = (
            'id',
            'name',
            'phone',
            'email',
            'subject',
            'message',
            'created_at',
        )

    def validate_message(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                'Message too short.'
            )

        return value


class ProductInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductInquiry

        fields = (
            'id',
            'product',
            'name',
            'phone',
            'email',
            'message',
            'created_at',
        )