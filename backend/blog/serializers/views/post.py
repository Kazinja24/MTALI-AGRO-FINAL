from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from blog.models import Post

from blog.serializers.post import (
    PostSerializer,
    PostCreateUpdateSerializer,
)

from common.permissions import IsAdmin


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    queryset = Post.objects.filter(
        is_published=True
    )

    filterset_fields = [
        'category',
    ]

    search_fields = [
        'title_en',
        'title_sw',
        'body_en',
        'body_sw',
    ]


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    queryset = Post.objects.filter(
        is_published=True
    )

    lookup_field = 'slug'


class AdminPostListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer

        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )


class AdminPostDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return PostCreateUpdateSerializer

        return PostSerializer