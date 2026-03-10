# Push BIOSPORTS vers GitHub
# Exécuter dans PowerShell : .\push-to-github.ps1
# Si "index.lock" existe : fermer Cursor/terminaux puis supprimer .git\index.lock

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (Test-Path .git\index.lock) {
    Remove-Item .git\index.lock -Force
}

# Exclure node_modules et .expo du suivi ( .gitignore déjà créé )
git rm -r --cached . 2>$null
git add -A

git status --short | Select-Object -First 20
Write-Host "`n--- Commit et push ---"

git commit -m "BIOSPORTS: chatbot, créer session, graphique jours joués, stats utilisateur, à propos, boutique"
git branch -M main
git push -u origin main

Write-Host "`nPush terminé : https://github.com/Shadow-Garden19/biosports-app"
