@echo off
:: Ouvre le port 8770 dans le pare-feu Windows (OBLIGATOIRE pour acces telephone)
:: Clic droit ^> Executer en tant qu'administrateur (une seule fois)
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
    netsh advfirewall firewall delete rule name="BIOSPORTS Web Telephone" >nul 2>&1
    netsh advfirewall firewall add rule name="BIOSPORTS Web Telephone" dir=in action=allow protocol=TCP localport=8765
    if %errorlevel% neq 0 (
        echo Erreur : lance ce fichier en "Executer en tant qu'administrateur".
    ) else (
        echo OK. Port 8770 autorise. Tu peux fermer cette fenetre.
    )
    pause
