# Genera il PDF di una scheda pesi renderizzando la pagina live in modalita stampa (A4 orizzontale).
# Uso:
#   powershell -File tools/genera-pdf-scheda.ps1 -Slug "trimestre-giugno-luglio-agosto-2026" -Out "scheda-forza-quotidiana-q3-2026.pdf"
# Richiede Google Chrome (o Edge) installato. La pagina viene aperta con ?sub=1 per superare il gate newsletter.

param(
  [Parameter(Mandatory = $true)][string]$Slug,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$Site = "https://forzaquotidiana.it"
)

$ErrorActionPreference = "Stop"

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" }
if (-not (Test-Path $chrome)) { throw "Chrome/Edge non trovati." }

$repo = Split-Path -Parent $PSScriptRoot
$destDir = Join-Path $repo "allenamenti\schede-peso\$Slug"
if (-not (Test-Path $destDir)) { throw "Cartella scheda non trovata: $destDir" }
$destPdf = Join-Path $destDir $Out

$url = "$Site/allenamenti/schede-peso/$Slug/?sub=1"

Write-Output "Genero PDF da: $url"
& $chrome --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=10000 "--print-to-pdf=$destPdf" $url | Out-Null

if (Test-Path $destPdf) {
  $len = (Get-Item $destPdf).Length
  Write-Output "OK -> $destPdf ($len byte)"
} else {
  throw "PDF non generato."
}
