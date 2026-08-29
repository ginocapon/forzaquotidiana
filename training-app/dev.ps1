# Avvia training-app — chiude vecchi server e riparte
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== Forza training-app — avvio ===" -ForegroundColor Cyan

# 1. Chiudi processi sulla porta 3000
$pids = @(Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)
foreach ($pid in $pids) {
  if ($pid -and $pid -ne 0) {
    Write-Host "Chiudo processo $pid (porta 3000)..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
  }
}

# 2. Rimuovi lock Next.js se resta
$lock = Join-Path $PSScriptRoot ".next\dev\lock"
if (Test-Path $lock) {
  Remove-Item $lock -Force -ErrorAction SilentlyContinue
  Write-Host "Rimosso lock .next/dev" -ForegroundColor Yellow
}

# 3. Avvia Postgres Docker (se Docker c'è)
if (Get-Command docker -ErrorAction SilentlyContinue) {
  docker compose up -d 2>$null
  if ($LASTEXITCODE -eq 0) { Write-Host "Postgres Docker OK" -ForegroundColor Green }
} else {
  Write-Host "Docker non trovato — uso DATABASE_URL dal .env" -ForegroundColor Yellow
}

# 4. Avvia app
Write-Host ""
Write-Host "Avvio su http://localhost:3000/admin ..." -ForegroundColor Green
Write-Host "Ctrl+C per fermare" -ForegroundColor DarkGray
corepack yarn dev
