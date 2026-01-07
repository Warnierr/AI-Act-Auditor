Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║     🚀 AI Act Auditor - Development Environment            ║
║              aiact.kenshu.dev                               ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Vérifier si les dépendances sont installées
Write-Host "`n[1/4] Vérification des dépendances..." -ForegroundColor Yellow

if (-not (Test-Path "backend\venv")) {
    Write-Host "❌ Virtual environment non trouvé !" -ForegroundColor Red
    Write-Host "   Créez-le avec: cd backend && python -m venv venv" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "❌ node_modules non trouvé !" -ForegroundColor Red
    Write-Host "   Installez avec: cd frontend && npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dépendances OK" -ForegroundColor Green

# Vérifier les fichiers .env
Write-Host "`n[2/4] Vérification de la configuration..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env non trouvé - Utilisation des valeurs par défaut" -ForegroundColor Yellow
} else {
    Write-Host "✅ backend\.env trouvé" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  frontend\.env.local non trouvé - Utilisation des valeurs par défaut" -ForegroundColor Yellow
} else {
    Write-Host "✅ frontend\.env.local trouvé" -ForegroundColor Green
}

# Nettoyer les processus existants
Write-Host "`n[3/4] Nettoyage des processus existants..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*uvicorn*"} | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "✅ Nettoyage terminé" -ForegroundColor Green

# Start Backend
Write-Host "`n[4/4] Démarrage des serveurs..." -ForegroundColor Green
Write-Host "🔧 Backend (port 8000)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd backend && venv\Scripts\activate && uvicorn main:app --reload"

# Wait for backend
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Frontend (port 3000)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev"

Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                    ✅ SERVEURS DÉMARRÉS                     ║
╚══════════════════════════════════════════════════════════════╝

📍 URLs Locales:
   Backend:  http://localhost:8000
   Docs API: http://localhost:8000/docs
   Frontend: http://localhost:3000

🧪 Tests Rapides:
   1. Ouvrir http://localhost:3000
   2. Créer un audit de test
   3. Consulter: TEST_LOCAL_RAPIDE.md

📚 Cas de test détaillés: CAS_TEST_REELS.md

🎨 Thèmes à tester:
   - Dark Purple (défaut)
   - Dark Blue
   - Light
   - Minimal

⚠️  Pour arrêter: Fermez les fenêtres CMD
    ou appuyez sur Ctrl+C dans chaque terminal

"@ -ForegroundColor Cyan

Write-Host "Appuyez sur une touche pour fermer ce message..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
