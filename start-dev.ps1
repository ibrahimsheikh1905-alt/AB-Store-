# Start both frontend and backend development servers
Write-Host "Starting E-commerce Development Servers..." -ForegroundColor Green
Write-Host ""

# Start backend server in background
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd server && npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Start frontend server in background
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd client && npm run dev"

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")