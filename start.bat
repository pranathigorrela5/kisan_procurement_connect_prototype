@echo off
TITLE Kisan Procurement Connect - Local SIH Engine Launcher
COLOR 0A

echo =======================================================================
echo          🌾 KISAN PROCUREMENT CONNECT - LOCAL SIH ENGINE 🌾
echo =======================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Node.js environment detected.

:: 2. Check node_modules
if not exist "node_modules\" (
    echo [2/3] Installing dependencies...
    call npm install
) else (
    echo [2/3] Dependencies already installed.
)

:: 3. Seed DB if missing
if not exist "kisan_procurement.db" (
    echo [3/3] Initializing and seeding demo database...
    call node seed.js
) else (
    echo [3/3] Database ready.
)

echo.
echo =======================================================================
echo  Server starting at http://localhost:3000
echo  Farmer Portal: http://localhost:3000/farmer
echo  Admin Portal: http://localhost:3000/admin (Passcode: admin123)
echo =======================================================================
echo.

:: Open default browser automatically
start http://localhost:3000

:: Start server
node server.js
