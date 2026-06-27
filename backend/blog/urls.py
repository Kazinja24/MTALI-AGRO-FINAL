from django.urls import path

from blog.serializers.views.post import (
    PostListView,
    PostDetailView,
    AdminPostListCreateView,
    AdminPostDetailView,
)

urlpatterns = [
    path("admin/", AdminPostListCreateView.as_view()),
    path("admin/<uuid:pk>/", AdminPostDetailView.as_view()),
    path("", PostListView.as_view()),
    path("<slug:slug>/", PostDetailView.as_view()),
]
