@echo off
chcp 65001 >nul
title SmartIA - servidor de desenvolvimento
cd /d "%~dp0"

REM Garante Node no PATH (útil logo após instalar o Node ou se o terminal não foi reiniciado)
set "PATH=%ProgramFiles%\nodejs;%PATH%"

if not exist "%ProgramFiles%\nodejs\node.exe" (
  echo Node.js nao encontrado em "%ProgramFiles%\nodejs".
  echo Instale: https://nodejs.org/ ^(LTS^) e reinicie o terminal.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias...
  call "%ProgramFiles%\nodejs\npm.cmd" install
  if errorlevel 1 pause & exit /b 1
)

echo.
echo Use: http://127.0.0.1:5173  ^(Ctrl+C para parar^)
echo Nao abra o index.html direto no navegador — precisa deste servidor.
echo.
call "%ProgramFiles%\nodejs\npm.cmd" run dev
pause
