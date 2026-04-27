@echo off
chcp 65001 >nul
title Copiar SmartIA para OneDrive Pessoal
cd /d "%~dp0"
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0copiar-para-onedrive-pessoal.ps1"
if errorlevel 1 pause
