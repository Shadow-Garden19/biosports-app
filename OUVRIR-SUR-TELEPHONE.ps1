# BIOSPORTS - Lancer l'app pour l'ouvrir sur le telephone (sans tunnel Expo)
# Execute en tant qu'administrateur une fois pour autoriser le pare-feu.

$Port = 8765
$RuleName = "BIOSPORTS Web Telephone (port $Port)"

# 1. Autoriser le port dans le pare-feu (necessite droits admin la premiere fois)
$existing = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
if (-not $existing) {
    Write-Host "Regle pare-feu : creation (peut demander Admin)..." -ForegroundColor Yellow
    try {
        New-NetFirewallRule -DisplayName $RuleName -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow -ErrorAction Stop | Out-Null
        Write-Host "Pare-feu : port $Port autorise." -ForegroundColor Green
    } catch {
        Write-Host "Impossible d'ajouter la regle (lance le script en Admin). Sinon ouvre manuellement le port $Port dans le Pare-feu Windows." -ForegroundColor Red
    }
} else {
    Write-Host "Pare-feu : regle deja presente." -ForegroundColor Green
}

# 2. Verifier que le build web existe
if (-not (Test-Path "dist\index.html")) {
    Write-Host "Build web absent. Export en cours..." -ForegroundColor Yellow
    npx expo export --platform web
    if (-not (Test-Path "dist\index.html")) {
        Write-Host "Erreur : export echoue." -ForegroundColor Red
        exit 1
    }
}

# 3. Lancer le serveur
Write-Host ""
Write-Host "Demarrage du serveur sur le reseau local..." -ForegroundColor Cyan
Write-Host "Pour arreter : ferme cette fenetre ou Ctrl+C" -ForegroundColor Gray
Write-Host ""
node serveur-web-telephone.js
