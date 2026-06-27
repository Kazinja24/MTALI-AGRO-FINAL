from common.views import (
    AdminMediaAssetDetailView,
    AdminMediaAssetListCreateView,
    AdminSiteSettingDetailView,
    AdminSiteSettingListCreateView,
    SiteSettingListView,
    VisitCountView,
)
from django.urls import path

urlpatterns = [
    path("admin/media/", AdminMediaAssetListCreateView.as_view()),
    path("admin/media/<uuid:pk>/", AdminMediaAssetDetailView.as_view()),
    path("admin/settings/", AdminSiteSettingListCreateView.as_view()),
    path("admin/settings/<uuid:pk>/", AdminSiteSettingDetailView.as_view()),
    path("settings/", SiteSettingListView.as_view()),
    path("analytics/visit/", VisitCountView.as_view()),
]
