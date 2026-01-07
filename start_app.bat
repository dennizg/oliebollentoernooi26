@echo off
echo ============================================
echo   OLIEBOLLENTOERNOOI DASHBOARD STARTEN...
echo ============================================
echo.
echo Stap 1: Controleren van installatie...
call npm install
echo.
echo Stap 2: Applicatie starten...
echo Open http://localhost:5173 in je browser nadat de server is gestart.
echo.
call npm run dev
pause
