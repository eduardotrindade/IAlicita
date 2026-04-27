# SmartIA — inicia o servidor sem depender do PATH do terminal
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$npm = Join-Path ${env:ProgramFiles} 'nodejs\npm.cmd'
$node = Join-Path ${env:ProgramFiles} 'nodejs\node.exe'

if (-not (Test-Path $node)) {
    Write-Host 'Node.js nao encontrado em Program Files.'
    Write-Host 'Baixe o instalador LTS em: https://nodejs.org/'
    Write-Host 'Depois feche e reabra o terminal (ou reinicie o PC).'
    Read-Host 'Pressione Enter para sair'
    exit 1
}

Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias (npm install)...'
    & $npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ''
Write-Host 'Servidor: http://127.0.0.1:5173'
Write-Host 'Pare com Ctrl+C'
Write-Host ''

& $npm run dev
exit $LASTEXITCODE
