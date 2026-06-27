from django.urls import path

from products.views.product import (
    ProductListView,
    ProductDetailView,
    AdminProductListCreateView,
    AdminProductDetailView,
)

urlpatterns = [
    path(
        'admin/',
        AdminProductListCreateView.as_view()
    ),

    path(
        'admin/<uuid:pk>/',
        AdminProductDetailView.as_view()
    ),

    path('', ProductListView.as_view()),

    path(
        '<slug:slug>/',
        ProductDetailView.as_view()
    ),
]