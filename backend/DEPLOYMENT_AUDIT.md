# Deployment audit — Backend (Render-ready)

## Summary

- Django 6 backend with REST API (DRF) and SimpleJWT
- Postgres-ready (supports `DATABASE_URL` or DB\_\* vars)
- Static files served via WhiteNoise
- Media storage integrated with Cloudinary (`cloudinary`, `django-cloudinary-storage` present)
- Gunicorn available in `requirements.txt` for production WSGI serving

## Key files inspected

- `manage.py` — entrypoint for Django commands
- `config/wsgi.py`, `config/asgi.py` — app entry
- `config/settings/base.py` and `config/settings/production.py` — env-driven config
- `requirements.txt` — runtime dependencies (Django, gunicorn, psycopg2-binary, cloudinary, whitenoise, etc.)
- `.env.example` — created (see this repo)

## Environment variables required (high priority)

- `DJANGO_SECRET_KEY` (required)
- `DEBUG` (set to `False` in production)
- `DATABASE_URL` OR `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `DEFAULT_FROM_EMAIL`, `EMAIL_*` for SMTP if sending email
- `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (for media)
- CORS / CSRF: `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`
- Optional: `DRF_*` rate limits, `JWT_*` lifetimes

## Production considerations

- Use Cloudinary for media (already installed). This avoids configuring S3 or Render persistent disks.
- WhiteNoise + `STATIC_ROOT`/`collectstatic` will serve static files; ensure `collectstatic` runs during deploy.
- Gunicorn is present and is a good production server for WSGI apps on Render.

## Recommended Render configuration

- Service type: Web Service (Python)
- Build command: `pip install -r backend/requirements.txt`
- Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
  - Render exposes `PORT` env var; bind to it.
- Environment: set `DJANGO_SECRET_KEY`, `DATABASE_URL` (use Render Postgres), `CLOUDINARY_URL` (or keys).
- Post-deploy commands (run on deploy or via a release/pin hook):
  - `python backend/manage.py migrate --noinput`
  - `python backend/manage.py collectstatic --noinput`

Optional files to add to repo (I can create these):

- `render.yaml` — for Infrastructure as Code (optional)
- `Procfile` — `web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- GitHub Actions workflow to run migrations and collectstatic during CI

## Potential blockers

- You must provide Render account access to create services and a domain registrar (Namecheap) to update DNS — I will provide exact instructions and files, but cannot perform those account actions.
- Ensure secrets (DB, Cloudinary, email) are available prior to deploy.

Next recommended steps (I can implement in-repo):

1. Add `render.yaml` and `Procfile` (I can create these).
2. Add GitHub Actions workflow to run migrations & collectstatic and optionally deploy via Render webhooks.
3. If you prefer Cloudinary, ensure account + `CLOUDINARY_URL` set on Render; otherwise I can add S3 support.

If you want, I'll now generate `render.yaml`, `Procfile`, and a `/.github/workflows/deploy.yml` that runs migrations and `collectstatic` and prepares the app for Render.
