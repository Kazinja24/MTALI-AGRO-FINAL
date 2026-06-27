from rest_framework import generics
from rest_framework.permissions import AllowAny

from products.models import Product
from products.serializers.product import (
    ProductSerializer,
    ProductCreateUpdateSerializer,
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)
from common.permissions import IsAdmin

from products.serializers.product import (
    ProductSerializer,
    ProductCreateUpdateSerializer,
)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    queryset = Product.objects.filter(active=True).order_by("-created_at")

    filterset_fields = [
        "category",
        "featured",
    ]

    search_fields = [
        "name",
        "description",
    ]


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    queryset = Product.objects.filter(active=True)

    lookup_field = "slug"


class AdminProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    queryset = Product.objects.all().order_by("-created_at")

    filterset_fields = [
        "category",
        "featured",
        "active",
    ]

    search_fields = [
        "name",
        "description",
    ]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductCreateUpdateSerializer

        return ProductSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return ProductCreateUpdateSerializer

        return ProductSerializer
