from common.models import MediaAsset, SiteSetting, VisitCount
from rest_framework import serializers


class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ("id", "title", "file", "file_url", "alt_text", "created_at")
        read_only_fields = ("id", "file_url", "created_at")

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ("id", "key", "label", "value", "updated_at")
        read_only_fields = ("id", "updated_at")


class VisitCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitCount
        fields = ("id", "name", "count", "updated_at")
        read_only_fields = ("id", "count", "updated_at")
