web: cd backend && DATABASE_URL="${DATABASE_URL_UNPOOLED:-$DATABASE_URL}" python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 4
