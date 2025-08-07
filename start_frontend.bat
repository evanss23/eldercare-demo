@echo off
echo =======================================
echo STARTING ELDERCARE FRONTEND
echo =======================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting Next.js development server...
echo.
echo The frontend will be available at:
echo http://localhost:3000
echo.
echo Pages:
echo - Home: http://localhost:3000
echo - Elder Interface: http://localhost:3000/elder  
echo - Caregiver Dashboard: http://localhost:3000/caregiver
echo.
npm run dev