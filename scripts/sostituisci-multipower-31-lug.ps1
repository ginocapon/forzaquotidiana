# Sostituisce il video sbagliato (era una copia del polpacci 30/07)
# con il file WhatsApp in img/
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$srcDownloads = "C:\Users\Utente\Downloads\mltipower gambe.mp4"
$srcWhatsApp = Join-Path $repo "img\WhatsApp Video .mp4"
$src = if (Test-Path -LiteralPath $srcDownloads) { $srcDownloads }
       elseif (Test-Path -LiteralPath $srcWhatsApp) { $srcWhatsApp }
       else { $null }
$destDir = Join-Path $repo "img\allenamenti\2026-07-31"
$dest = Join-Path $destDir "multipower-gambe.mp4"
$poster = Join-Path $destDir "multipower-gambe-poster.jpg"

if (-not $src) {
    Write-Error "File non trovato.`nCerca: C:\Users\Utente\Downloads\mltipower gambe.mp4`noppure: img\WhatsApp Video .mp4"
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -LiteralPath $src -Destination $dest -Force
Write-Host "Video copiato -> img\allenamenti\2026-07-31\multipower-gambe.mp4"

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffmpeg) {
    & ffmpeg -y -ss 00:00:02 -i $dest -frames:v 1 -q:v 3 $poster 2>$null
    Write-Host "Poster rigenerato."
} else {
    Write-Host "ffmpeg non trovato: salta poster (opzionale)."
}

Write-Host ""
Write-Host "Prossimi passi:"
Write-Host "  git add img/allenamenti/2026-07-31/multipower-gambe.mp4 img/allenamenti/2026-07-31/multipower-gambe-poster.jpg"
Write-Host "  git commit -m `"Fix video multipower sessione 31/07`""
Write-Host "  git push origin main"
Write-Host "  Remove-Item -LiteralPath `"img\WhatsApp Video .mp4`""
