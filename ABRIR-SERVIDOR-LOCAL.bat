@echo off
chcp 65001 >nul
title SmartIA - servidor local (sem Node)
cd /d "%~dp0"
echo.
echo Iniciando servidor em http://127.0.0.1:8765 ...
echo Feche esta janela ou pressione Ctrl+C no PowerShell para parar.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor-local.ps1"
echo.
pause
