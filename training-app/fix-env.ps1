# Scrive un .env corretto (righe separate, Docker locale)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$content = @"
DATABASE_URL=postgresql://training:training@localhost:55432/training
PAYLOAD_SECRET=forza-training-dev-secret-2026-min-32-chars
NEXT_PUBLIC_BASE_URL=http://localhost:3000
"@

[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot ".env"), $content.TrimEnd() + "`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "Scritto .env corretto (3 righe, Docker locale)." -ForegroundColor Green

if (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Host "Avvio Postgres Docker..." -ForegroundColor Cyan
  docker compose up -d
  Start-Sleep -Seconds 3
} else {
  Write-Host "ATTENZIONE: Docker non installato. Installa Docker Desktop oppure usa Supabase nel .env" -ForegroundColor Red
  exit 1
}

Write-Host "Migrate..." -ForegroundColor Cyan
corepack yarn payload migrate

Write-Host "OK. Ora: .\dev.ps1" -ForegroundColor Green
