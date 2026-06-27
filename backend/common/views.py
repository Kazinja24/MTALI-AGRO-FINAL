from common.models import MediaAsset, SiteSetting, VisitCount
from common.permissions import IsAdmin
from common.serializers import (
    MediaAssetSerializer,
    SiteSettingSerializer,
    VisitCountSerializer,
)
from django.db.models import F
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class AdminMediaAssetListCreateView(generics.ListCreateAPIView):
    serializer_class = MediaAssetSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    queryset = MediaAsset.objects.all().order_by("-created_at")


class AdminMediaAssetDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MediaAssetSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = MediaAsset.objects.all()


class AdminSiteSettingListCreateView(generics.ListCreateAPIView):
    serializer_class = SiteSettingSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [JSONParser, FormParser]
    queryset = SiteSetting.objects.all().order_by("key")


class AdminSiteSettingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SiteSettingSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [JSONParser, FormParser]
    queryset = SiteSetting.objects.all()


class SiteSettingListView(generics.ListAPIView):
    serializer_class = SiteSettingSerializer
    permission_classes = [AllowAny]
    queryset = SiteSetting.objects.all().order_by("key")


class VisitCountView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser]

    def get(self, request):
        visit, _ = VisitCount.objects.get_or_create(name="website")
        return Response({"count": visit.count})

    def post(self, request):
        visit, _ = VisitCount.objects.get_or_create(name="website")
        visit.count = F("count") + 1
        visit.save()
        visit.refresh_from_db()
        return Response({"count": visit.count}, status=status.HTTP_201_CREATED)
