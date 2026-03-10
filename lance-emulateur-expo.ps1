# Lance l'émulateur Android puis l'app BIOSPORTS avec Expo
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools;$env:PATH"

# -no-accel = mode logiciel (sans hyperviseur Windows)
# -no-metrics = evite l'avertissement de telemetrie
Write-Host "Demarrage de l'emulateur Android (Pixel_34) en mode logiciel..." -ForegroundColor Cyan
Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd","Pixel_34","-no-accel","-no-metrics" -WindowStyle Normal

Write-Host "Attente du demarrage de l'emulateur (60 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host "Lancement de l'app BIOSPORTS sur l'emulateur..." -ForegroundColor Green
Set-Location $PSScriptRoot
npx expo start --android --port 8082
