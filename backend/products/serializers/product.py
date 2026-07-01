from rest_framework import serializers

from products.models import Product
from crops.models import Crop
from common.validators import validate_uploaded_image


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = (
            "id",
            "name",
        )


class ProductSerializer(serializers.ModelSerializer):
    crops = CropSerializer(many=True, read_only=True)

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "category",
            "description",
            "price",
            "currency",
            "image_url",
            "featured",
            "active",
            "crops",
            "created_at",
        )

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    crops = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )

    class Meta:
        model = Product

        fields = (
            'id',
            'name',
            'slug',
            'category',
            'description',
            'price',
            'currency',
            'image',
            'featured',
            'active',
            'crops',
        )

    def _get_crop_instances(self, crops):
        crop_instances = []

        for crop in crops:
            crop_name = str(crop).strip()
            if not crop_name:
                continue
            crop_obj, _ = Crop.objects.get_or_create(
                name__iexact=crop_name,
                defaults={'name': crop_name},
            )
            crop_instances.append(crop_obj)

        return crop_instances

    def create(self, validated_data):
        crops_data = validated_data.pop('crops', None)
        product = super().create(validated_data)
        if crops_data is not None:
            product.crops.set(self._get_crop_instances(crops_data))
        return product

    def update(self, instance, validated_data):
        crops_data = validated_data.pop('crops', None)
        product = super().update(instance, validated_data)
        if crops_data is not None:
            product.crops.set(self._get_crop_instances(crops_data))
        return product

    def validate_price(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                'Price cannot be negative.'
            )

        return value

    def validate_image(self, value):
        return validate_uploaded_image(value)

    def to_representation(self, instance):
        return ProductSerializer(instance, context=self.context).data
