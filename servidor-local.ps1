# Servidor HTTP minimo (sem Node) — SmartIA
# Se der erro de permissao, execute UMA VEZ no PowerShell (Administrador):
#   netsh http add urlacl url=http://127.0.0.1:8765/ user=Everyone

param([int]$Port = 8765)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = [System.IO.Path]::GetFullPath($root)

$listener = [System.Net.HttpListener]::new()
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "ERRO ao abrir a porta $Port : $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tente abrir o PowerShell como Administrador e rode (uma vez):" -ForegroundColor Yellow
    Write-Host "  netsh http add urlacl url=$prefix user=$env:USERNAME" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ou use o arquivo ABRIR-NO-EDGE.bat para abrir o HTML direto." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para fechar"
    exit 1
}

$openUrl = "${prefix}smartia-portal-offline.html"
Start-Sleep -Milliseconds 200
Start-Process $openUrl

Write-Host ""
Write-Host "SmartIA — servidor local" -ForegroundColor Cyan
Write-Host "  URL:   $openUrl"
Write-Host "  Pasta: $root"
Write-Host "  Pare com Ctrl+C"
Write-Host ""

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($rel)) {
            $rel = 'smartia-portal-offline.html'
        }
        $rel = $rel -replace '/', [char][System.IO.Path]::DirectorySeparatorChar

        $candidate = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $rel))
        if (-not $candidate.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
            $res.StatusCode = 403
            $res.Close()
            continue
        }

        if (-not (Test-Path -LiteralPath $candidate)) {
            $res.StatusCode = 404
            $res.Close()
            continue
        }

        $bytes = [System.IO.File]::ReadAllBytes($candidate)
        $ext = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
        $mime = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css' { 'text/css; charset=utf-8' }
            '.js' { 'application/javascript; charset=utf-8' }
            '.svg' { 'image/svg+xml' }
            '.json' { 'application/json; charset=utf-8' }
            '.ico' { 'image/x-icon' }
            default { 'application/octet-stream' }
        }

        $res.StatusCode = 200
        $res.ContentType = $mime
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.OutputStream.Close()
        $res.Close()
    }
} finally {
    $listener.Stop()
}
