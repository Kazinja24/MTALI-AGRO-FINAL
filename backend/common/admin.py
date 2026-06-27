from django.contrib import admin

from common.models import MediaAsset, SiteSetting


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title", "alt_text")


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "updated_at")
    search_fields = ("key", "label", "value")
