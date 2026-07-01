from rest_framework import serializers

from blog.models import Post
from common.text import sanitize_text
from common.validators import validate_uploaded_image


class PostSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post

        fields = (
            'id',
            'title_en',
            'title_sw',
            'slug',
            'category',
            'excerpt_en',
            'excerpt_sw',
            'body_en',
            'body_sw',
            'cover_image_url',
            'published_at',
        )

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url

        return None


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post

        fields = (
            'id',
            'title_en',
            'title_sw',
            'slug',
            'category',
            'excerpt_en',
            'excerpt_sw',
            'body_en',
            'body_sw',
            'cover_image',
            'is_published',
            'published_at',
        )

    def validate_cover_image(self, value):
        return validate_uploaded_image(value)

    def validate_title_en(self, value):
        value = sanitize_text(value, collapse_whitespace=True, allow_blank=False) or ""
        if not value:
            raise serializers.ValidationError("Title cannot be empty after sanitization.")
        return value

    def validate_title_sw(self, value):
        return sanitize_text(value, collapse_whitespace=True)

    def validate_excerpt_en(self, value):
        return sanitize_text(value)

    def validate_excerpt_sw(self, value):
        return sanitize_text(value)

    def validate_body_en(self, value):
        value = sanitize_text(value, allow_blank=False) or ""
        if not value:
            raise serializers.ValidationError("Body cannot be empty after sanitization.")
        return value

    def validate_body_sw(self, value):
        return sanitize_text(value)
