@echo off
title BIOSPORTS - Web (Chrome)
cd /d "%~dp0"

echo Demarrage de l'app en mode web...
echo Une fois la page ouverte, appuie sur F12 puis sur l'icone telephone pour simuler un mobile.
echo.
start "" "http://localhost:8082"
call npx expo start --web --port 8082

pause
