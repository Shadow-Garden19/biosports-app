@echo off
title BIOSPORTS - Emulateur + Expo
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

echo Demarrage de l'emulateur (fenetre va s'ouvrir, patientez)...
start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_34 -no-accel -no-metrics

echo.
echo Attente 90 secondes le temps que l'emulateur demarre...
timeout /t 90 /nobreak

echo Lancement de l'app BIOSPORTS...
cd /d "%~dp0"
call npx expo start --android --port 8082

pause
