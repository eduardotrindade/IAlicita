@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
  where py >nul 2>&1
  if errorlevel 1 (
    echo Python nao encontrado. Instale de https://www.python.org/downloads/
    echo Marque "Add python.exe to PATH" na instalacao.
    pause
    exit /b 1
  )
  set "PY=py"
) else (
  set "PY=python"
)

if not exist ".venv\Scripts\python.exe" (
  echo Criando ambiente virtual .venv ...
  %PY% -m venv .venv
  if errorlevel 1 (
    echo Falha ao criar venv.
    pause
    exit /b 1
  )
)

call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo Falha ao instalar dependencias.
  pause
  exit /b 1
)

echo.
echo Portal: http://127.0.0.1:8765/
echo Pare com Ctrl+C
echo.
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/"
python app.py
pause
