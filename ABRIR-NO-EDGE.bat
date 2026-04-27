@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "ARQUIVO=%~dp0smartia-portal-offline.html"

if not exist "%ARQUIVO%" (
  echo Arquivo nao encontrado:
  echo %ARQUIVO%
  pause
  exit /b 1
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%ARQUIVO%"
  exit /b 0
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%ARQUIVO%"
  exit /b 0
)

REM Fallback: associacao padrao do Windows
start "" "%ARQUIVO%"
