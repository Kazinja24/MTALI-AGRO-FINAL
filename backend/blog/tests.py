from django.test import TestCase

from blog.models import Post
from blog.serializers.post import PostCreateUpdateSerializer


class BlogSanitizationTests(TestCase):
    def test_post_save_strips_html_from_content(self):
        post = Post.objects.create(
            title_en="<script>alert('x')</script>Clean title",
            body_en="<p>Hello <strong>world</strong><script>alert(1)</script></p>",
        )

        post.refresh_from_db()

        self.assertEqual(post.title_en, "Clean title")
        self.assertEqual(post.body_en, "Hello world")

    def test_serializer_sanitizes_optional_fields(self):
        serializer = PostCreateUpdateSerializer(
            data={
                "title_en": "<b>New</b> post",
                "category": "General",
                "excerpt_en": "<img src=x onerror=alert(1)>Safe excerpt",
                "body_en": "<div>Body</div>",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["title_en"], "New post")
        self.assertEqual(serializer.validated_data["excerpt_en"], "Safe excerpt")
        self.assertEqual(serializer.validated_data["body_en"], "Body")
