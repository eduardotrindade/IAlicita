# Copia a pasta SmartIA (esta pasta) para o OneDrive Pessoal ou pasta que voce escolher.
# Requer: PowerShell (ja vem no Windows).

$ErrorActionPreference = 'Continue'
$origem = $PSScriptRoot
if (-not $origem) {
    $origem = Split-Path -Parent $MyInvocation.MyCommand.Path
}
$nomePasta = Split-Path -Leaf ($origem.TrimEnd('\', '/'))

$logPath = Join-Path $env:USERPROFILE 'Desktop\SmartIA-copia-log.txt'

function Write-Log($msg) {
    $line = ('{0} {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg)
    Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
    Write-Host $msg
}

function Add-Unique {
    param([System.Collections.Generic.List[string]]$list, [string]$path)
    if (-not $path) { return }
    try {
        $full = [System.IO.Path]::GetFullPath($path)
        if (-not (Test-Path -LiteralPath $full)) { return }
        foreach ($x in $list) {
            if ($x -ieq $full) { return }
        }
        [void]$list.Add($full)
    } catch { }
}

function Get-CandidateRoots {
    $roots = [System.Collections.Generic.List[string]]::new()

    # 1) Variaveis de ambiente (Microsoft costuma definir)
    foreach ($key in @('OneDriveConsumer', 'OneDrive', 'OneDriveCommercial')) {
        Add-Unique $roots $([Environment]::GetEnvironmentVariable($key, 'User'))
    }

    # 2) Registro: contas OneDrive
    try {
        $accPath = 'HKCU:\Software\Microsoft\OneDrive\Accounts'
        if (Test-Path -LiteralPath $accPath) {
            Get-ChildItem -LiteralPath $accPath -ErrorAction SilentlyContinue | ForEach-Object {
                try {
                    $p = (Get-ItemProperty -LiteralPath $_.PSPath -ErrorAction SilentlyContinue).UserFolder
                    Add-Unique $roots $p
                } catch { }
            }
        }
    } catch { }

    # 3) Pastas comuns no perfil
    $profile = $env:USERPROFILE
    if ($profile) {
        foreach ($name in @('OneDrive', 'OneDrive - Pessoal', 'OneDrive - Personal')) {
            Add-Unique $roots (Join-Path $profile $name)
        }
        Get-ChildItem -LiteralPath $profile -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like 'OneDrive*' } |
            ForEach-Object { Add-Unique $roots $_.FullName }
    }

    return $roots
}

function Copy-WithRobocopy {
    param([string]$src, [string]$dst)
    $rob = Join-Path $env:SystemRoot 'System32\robocopy.exe'
    if (-not (Test-Path -LiteralPath $rob)) { return $false }
    # /E subpastas; /XD ignora pastas pesadas (node_modules sincroniza mal no OneDrive)
    $args = @(
        $src, $dst
        '/E', '/COPY:DAT', '/R:2', '/W:1'
        '/XD', 'node_modules', '.git', '.venv', '__pycache__', '.pytest_cache'
        '/NFL', '/NDL', '/NJH', '/NJS'
    )
    $p = Start-Process -FilePath $rob -ArgumentList $args -Wait -PassThru -NoNewWindow
    # robocopy: 0-7 = sucesso com variacoes; >=8 = erro
    return ($p.ExitCode -lt 8)
}

function Show-FolderPicker {
    try {
        Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop | Out-Null
        $d = New-Object System.Windows.Forms.FolderBrowserDialog
        $d.Description = 'Escolha ONDE criar a pasta SmartIA (ex.: seu OneDrive Pessoal)'
        $d.ShowNewFolderButton = $true
        if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
            return $null
        }
        return $d.SelectedPath
    } catch {
        return $null
    }
}

# --- Inicio ---
'' | Set-Content -LiteralPath $logPath -Encoding UTF8
Write-Log "=== Copia SmartIA ==="
Write-Log "Origem detectada: $origem"
Write-Log "Nome da pasta: $nomePasta"

if (-not (Test-Path -LiteralPath $origem)) {
    Write-Log "ERRO: pasta origem invalida."
    Read-Host 'Pressione Enter para fechar'
    exit 1
}

$roots = Get-CandidateRoots
Write-Log ("Pastas candidatas encontradas: {0}" -f $roots.Count)
foreach ($r in $roots) { Write-Log ("  - {0}" -f $r) }

$destRoot = $null

if ($roots.Count -eq 0) {
    Write-Host ''
    Write-Host 'Nao detectei OneDrive automaticamente.'
    Write-Host 'Abrindo janela para voce ESCOLHER a pasta de destino...'
    Write-Host '(Ex.: abra "OneDrive - Pessoal" no lado esquerdo e selecione Documentos ou a propria raiz do OneDrive)'
    Write-Host ''
    $destRoot = Show-FolderPicker
    if (-not $destRoot) {
        Write-Log 'Usuario cancelou ou falha no seletor de pastas.'
        Write-Host ''
        Write-Host "Log salvo em: $logPath"
        Read-Host 'Pressione Enter para fechar'
        exit 1
    }
    Write-Log "Destino escolhido manualmente: $destRoot"
} elseif ($roots.Count -eq 1) {
    $destRoot = $roots[0]
    Write-Log "Usando unica candidata: $destRoot"
} else {
    Write-Host ''
    Write-Host 'Varias pastas OneDrive encontradas. Qual usar como DESTINO?'
    for ($i = 0; $i -lt $roots.Count; $i++) {
        Write-Host ("  [{0}] {1}" -f ($i + 1), $roots[$i])
    }
    Write-Host ("  [{0}] Escolher OUTRA pasta manualmente..." -f ($roots.Count + 1))
    $t = Read-Host ("Digite o numero (1-{0}) ou Enter=1" -f ($roots.Count + 1))
    $n = 1
    if ($t) { [void][int]::TryParse($t, [ref]$n) }
    if ($n -eq $roots.Count + 1) {
        $destRoot = Show-FolderPicker
        if (-not $destRoot) {
            Write-Log 'Cancelado.'
            Read-Host 'Pressione Enter para fechar'
            exit 1
        }
    } elseif ($n -ge 1 -and $n -le $roots.Count) {
        $destRoot = $roots[$n - 1]
    } else {
        $destRoot = $roots[0]
    }
    Write-Log "Destino selecionado: $destRoot"
}

$destino = Join-Path $destRoot $nomePasta

if (([System.IO.Path]::GetFullPath($origem)) -ieq ([System.IO.Path]::GetFullPath($destino))) {
    Write-Log 'Origem e destino sao a mesma pasta. Nada a copiar.'
    Write-Host ''
    Write-Host 'Voce ja esta com o projeto NESTA pasta. Nao ha copia necessaria.'
    Write-Host "Pasta: $origem"
    Read-Host 'Pressione Enter para fechar'
    exit 0
}

if (Test-Path -LiteralPath $destino) {
    Write-Host ''
    Write-Host "Ja existe: $destino"
    $conf = Read-Host 'Substituir tudo? (S/N)'
    if ($conf -notmatch '^[sSyY]') {
        Write-Log 'Usuario cancelou (pasta ja existia).'
        Read-Host 'Pressione Enter para fechar'
        exit 0
    }
    Remove-Item -LiteralPath $destino -Recurse -Force -ErrorAction Stop
}

Write-Host ''
Write-Log 'Copiando... (pode demorar se houver node_modules)'
Write-Log "  De:   $origem"
Write-Log "  Para: $destino"

$parent = Split-Path -LiteralPath $destino -Parent
if (-not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
}

$ok = $false
if (Copy-WithRobocopy -src $origem -dst $destino) {
    Write-Log 'Robocopy concluiu com codigo de sucesso.'
    $ok = $true
} else {
    Write-Log 'Robocopy indisponivel ou falhou. Tentando Copy-Item...'
    try {
        Copy-Item -LiteralPath $origem -Destination $destino -Recurse -Force -ErrorAction Stop
        $ok = $true
        Write-Log 'Copy-Item concluido.'
    } catch {
        Write-Log ("ERRO Copy-Item: {0}" -f $_.Exception.Message)
    }
}

if (-not $ok) {
    Write-Host ''
    Write-Host 'FALHA ao copiar. Veja o log:'
    Write-Host $logPath
    Read-Host 'Pressione Enter para fechar'
    exit 1
}

Write-Host ''
Write-Host 'CONCLUIDO.'
Write-Host "Pasta criada em:"
Write-Host "  $destino"
Write-Log "Sucesso: $destino"

try {
    Start-Process -FilePath 'explorer.exe' -ArgumentList $destino
} catch { }

Write-Host ''
Write-Host "Log: $logPath"
Write-Host 'Depois: botao direito na pasta > Manter sempre neste dispositivo'
Write-Host ''
Read-Host 'Pressione Enter para fechar'
