@echo off
chcp 65001 >nul
cd /d "%~dp0\.."

where python >nul 2>&1
if errorlevel 1 (
  where py >nul 2>&1
  if errorlevel 1 (
    echo Python nao encontrado. Instale de https://www.python.org/downloads/
    pause
    exit /b 1
  )
  set "PY=py"
) else (
  set "PY=python"
)

echo Servidor minimo (sem Flask / sem pip)
echo http://127.0.0.1:8765/
echo.
%PY% "%~dp0servidor_minimo.py"
pause
