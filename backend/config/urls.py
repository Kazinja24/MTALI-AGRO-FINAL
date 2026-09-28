from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static


def api_root(request):
    return JsonResponse(
        {
            "status": "ok",
            "message": "Mtali Agro API is running.",
        }
    )


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),

    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/products/', include('products.urls')),
    path('api/v1/inquiries/', include('inquiries.urls')),
    path('api/v1/blog/', include('blog.urls')),
    path('api/v1/common/', include('common.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
