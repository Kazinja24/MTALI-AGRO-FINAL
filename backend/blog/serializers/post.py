from rest_framework import serializers

from blog.models import Post


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
