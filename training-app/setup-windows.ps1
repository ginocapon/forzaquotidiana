# Setup rapido Windows — training-app
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== Forza training-app — setup .env ===" -ForegroundColor Cyan

# .env corretto (Payload = solo PostgreSQL, NON https://supabase.co)
@"
DATABASE_URL=postgresql://training:training@localhost:55432/training
PAYLOAD_SECRET=forza-training-dev-secret-2026-min-32-chars
NEXT_PUBLIC_BASE_URL=http://localhost:3000
"@ | Set-Content -Path .env -Encoding utf8

Write-Host "Scritto .env con Postgres Docker locale." -ForegroundColor Green
Write-Host ""
Write-Host "Per Supabase invece di Docker, apri .env e sostituisci DATABASE_URL con la URI"
Write-Host "da Dashboard -> Database -> Connection string -> Direct (5432)"
Write-Host "Formato Supabase (Windows — usa Session pooler, NON db.xxx.supabase.co):"
Write-Host "  postgresql://postgres.ieeriszlalrsbfsnarih:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
Write-Host ""
Write-Host "Avvia DB + app (un solo comando):"
Write-Host "  .\dev.ps1"
Write-Host "  oppure doppio click su AVVIA.bat"
Write-Host ""
Write-Host "Oppure manualmente:"
Write-Host "  docker compose up -d"
Write-Host "  corepack yarn check-env"
Write-Host "  corepack yarn payload migrate"
Write-Host "  corepack yarn dev"
