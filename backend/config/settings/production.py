from .base import *  # noqa: F401,F403
from django.core.exceptions import ImproperlyConfigured

DEBUG = False

if not env("DATABASE_URL", default="").strip().strip("\"'"):
    raise ImproperlyConfigured(
        "Set DATABASE_URL to a reachable PostgreSQL database in production."
    )

# Render sends requests with this hostname.  Set ALLOWED_HOSTS in the service
# environment to replace this default when adding a custom domain.
ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
    default=["mtali-agro-final.onrender.com"],
)
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])
CORS_ALLOWED_ORIGIN_REGEXES = env.list("CORS_ALLOWED_ORIGIN_REGEXES", default=[])
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=CORS_ALLOWED_ORIGINS)

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=True)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=True)
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=31536000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS", default=True
)
SECURE_HSTS_PRELOAD = env.bool("SECURE_HSTS_PRELOAD", default=True)

MIDDLEWARE = [
    *MIDDLEWARE[:2],
    "whitenoise.middleware.WhiteNoiseMiddleware",
    *MIDDLEWARE[2:],
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# If Cloudinary credentials are provided, use Cloudinary for media storage.
if env("CLOUDINARY_URL", default="") or (
    env("CLOUDINARY_CLOUD_NAME", default="")
    and env("CLOUDINARY_API_KEY", default="")
    and env("CLOUDINARY_API_SECRET", default="")
):
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": env("CLOUDINARY_CLOUD_NAME", default=""),
        "API_KEY": env("CLOUDINARY_API_KEY", default=""),
        "API_SECRET": env("CLOUDINARY_API_SECRET", default=""),
    }
    # Use django-cloudinary-storage's default media storage
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
