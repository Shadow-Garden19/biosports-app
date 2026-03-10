@echo off
title BIOSPORTS - Ouvrir sur telephone
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "OUVRIR-SUR-TELEPHONE.ps1"
pause
