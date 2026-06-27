from django.contrib import admin

from crops.models import Crop


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
