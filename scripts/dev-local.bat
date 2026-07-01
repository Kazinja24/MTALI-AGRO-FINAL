@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Mtali Agro Local Dev (Windows)
REM Starts:
REM  1) Django backend: http://127.0.0.1:8000
REM  2) Frontend (Vite/TanStack): http://127.0.0.1:5173
REM
REM Usage:
REM   scripts\dev-local.bat
REM
REM Stops both with Ctrl+C in this terminal.
REM ==============================

set ROOT_DIR=%~dp0..
for %%I in (%ROOT_DIR%) do set ROOT_DIR=%%~fI

set BACKEND_DIR=%ROOT_DIR%\backend
set FRONTEND_DIR=%ROOT_DIR%\frontend\mtali-agro-growth-main

set PYTHON_EXE=%BACKEND_DIR%\venv\Scripts\python.exe

set VITE_API_BASE_URL=http://127.0.0.1:8000

echo [dev-local] Root: %ROOT_DIR%

if exist "%PYTHON_EXE%" (
  echo [dev-local] Using backend python: %PYTHON_EXE%
) else (
  echo [dev-local] ERROR: Not found: %PYTHON_EXE%
  echo [dev-local] Create venv in backend (backend\venv) or install deps first.
  echo [dev-local] Expected python at: %BACKEND_DIR%\venv\Scripts\python.exe
  exit /b 1
)

REM Start Django backend in background
start "mtali-agro-backend" /b cmd /c "cd /d %BACKEND_DIR% && ^"%PYTHON_EXE%^" manage.py runserver 127.0.0.1:8000"
set BACKEND_PID=!errorlevel!

REM Start frontend in background
start "mtali-agro-frontend" /b cmd /c "cd /d %FRONTEND_DIR% && set VITE_API_BASE_URL=%VITE_API_BASE_URL% && npm run dev -- --host 127.0.0.1 --port 5173"
set FRONTEND_PID=!errorlevel!

echo.
echo [dev-local] Backend should be up at:   http://127.0.0.1:8000
echo [dev-local] Frontend should be up at:  http://127.0.0.1:5173
echo.
echo [dev-local] Press Ctrl+C in this terminal to stop.

REM Keep this terminal alive
:loop
timeout /t 2 >nul
goto loop

