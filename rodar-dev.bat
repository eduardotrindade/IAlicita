@echo off
chcp 65001 >nul
title SmartIA - Servidor de Desenvolvimento
cd /d "%~dp0"

echo Verificando instalacao do Node.js...

REM Tenta encontrar o Node.js em locais comuns
set "NODE_PATH="
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_PATH=%ProgramFiles%\nodejs"
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
where node >nul 2>nul && (if not defined NODE_PATH set "NODE_PATH_FROM_WHERE=true")

if not defined NODE_PATH and not defined NODE_PATH_FROM_WHERE (
  echo.
  echo [ERRO] Node.js nao foi encontrado.
  echo Por favor, instale a versao LTS a partir de: https://nodejs.org/
  pause
  exit /b 1
)

if defined NODE_PATH (
  set "NPM_CMD="%NODE_PATH%\npm.cmd""
) else (
  set "NPM_CMD=npm"
)

if not exist "node_modules\" (
  echo.
  echo Instalando dependencias...
  call %NPM_CMD% install
  if errorlevel 1 pause & exit /b 1
)

echo.
echo =================================================================
echo Servidor iniciado. Acesse no navegador: http://localhost:3001
echo (Pressione Ctrl+C nesta janela para parar o servidor)
echo.
call %NPM_CMD% run dev
pause
