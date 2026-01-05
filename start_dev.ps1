Write-Host "Starting AI Act Auditor..."

# Stop existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Launch Backend from project root
Start-Process -FilePath "cmd.exe" -ArgumentList "/k backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000"

# Launch Frontend
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev"

Write-Host "Backend running on http://localhost:8000"
Write-Host "Frontend running on http://localhost:3000"
