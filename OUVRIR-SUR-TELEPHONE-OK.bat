@echo off
title BIOSPORTS - Pour telephone
cd /d "%~dp0"

echo.
echo ============================================
echo   BIOSPORTS - Acces depuis ton telephone
echo ============================================
echo.

if not exist "dist\index.html" (
    echo Build web absent. Export en cours...
    call npx expo export --platform web
    echo.
)

echo Demarrage du serveur sur le reseau (port 8770)...
echo.
echo   IMPORTANT - Si ton tel ne se connecte pas :
echo   Clic droit sur "LANCER-EN-ADMIN.bat" ^> Executer en tant qu'administrateur
echo   (une seule fois, pour autoriser le pare-feu)
echo.
echo   Puis sur ton telephone (meme Wi-Fi que le PC) :
echo   Ouvre Chrome et va sur l'adresse affichee ci-dessous.
echo.
node serveur-web-telephone.js
pause
