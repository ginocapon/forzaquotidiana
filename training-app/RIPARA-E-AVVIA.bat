@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-env.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0dev.ps1"
