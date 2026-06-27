# Mtali Agro — Local Development (One command, Windows)

This repo has a **Django backend** and a **TanStack/Vite frontend**.

## Prerequisites

1. You must have Python installed.
2. Backend venv should exist at:
   - `backend/venv/Scripts/python.exe`
3. Frontend node modules should be installed (run once if needed):
   - `cd frontend/mtali-agro-growth-main`
   - `npm install`

## Run everything (backend + frontend)

From the repo root (`MTALI AGRO`), run:

```bat
scripts\dev-local.bat
```

It starts:

- **Backend API**: `http://127.0.0.1:8000`
  - Health check (if available): `http://127.0.0.1:8000/api/v1/health/`
  - Admin: `http://127.0.0.1:8000/admin/`
- **Frontend Web**: `http://127.0.0.1:5173`

## Stop

Stop the running process by closing/interrupting the terminal (Ctrl+C).

## Notes

- The script sets `VITE_API_URL=http://127.0.0.1:8000` for the frontend automatically.
- Django is started with:
  - `python backend/manage.py runserver 127.0.0.1:8000`
