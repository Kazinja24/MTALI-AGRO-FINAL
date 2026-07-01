from pathlib import Path

from PIL import Image, UnidentifiedImageError
from django.core.exceptions import ValidationError


MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_IMAGE_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_uploaded_image(file):
    if not file:
        return file

    errors = []

    if file.size > MAX_IMAGE_SIZE_BYTES:
        errors.append("Image must be 5 MB or smaller.")

    extension = Path(file.name).suffix.lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        errors.append("Only JPG, JPEG, PNG, and WEBP images are allowed.")

    content_type = getattr(file, "content_type", None)
    if content_type and content_type not in ALLOWED_IMAGE_MIME_TYPES:
        errors.append("Unsupported image MIME type.")

    try:
        file.seek(0)
        with Image.open(file) as image:
            image.verify()
        file.seek(0)
    except (UnidentifiedImageError, OSError, ValueError):
        errors.append("Upload must be a valid image file.")
    finally:
        try:
            file.seek(0)
        except Exception:
            pass

    if errors:
        raise ValidationError(errors)

    return file
