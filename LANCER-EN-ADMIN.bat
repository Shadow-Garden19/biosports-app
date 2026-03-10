@echo off
echo.
echo ========================================
echo   BIOSPORTS - Pour ouvrir sur le tel
echo ========================================
echo   Si Windows demande une autorisation,
echo   cliquez Oui pour ouvrir le pare-feu.
echo ========================================
echo.
:: Demande les droits administrateur pour autoriser le pare-feu
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' neq '0' (
    echo Demande des droits administrateur...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    cd /d "%~dp0"
    echo.
    echo === Autorisation du pare-feu (port 8765) ===
    netsh advfirewall firewall delete rule name="BIOSPORTS Web Telephone" >nul 2>&1
    netsh advfirewall firewall add rule name="BIOSPORTS Web Telephone" dir=in action=allow protocol=TCP localport=8765
    if %errorlevel% neq 0 (
        echo Erreur pare-feu. Verifiez manuellement.
    ) else (
        echo Pare-feu : port 8765 autorise.
    )
    echo.
    echo === Demarrage du serveur ===
    if not exist "dist\index.html" (
        echo Build web absent. Export en cours...
        call npx expo export --platform web
    )
    node serveur-web-telephone.js
    pause
