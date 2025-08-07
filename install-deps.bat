@echo off
echo Installing dependencies...
echo.
echo This may take a few minutes. Please be patient.
echo.

REM Clean install
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo.
echo Installing fresh dependencies...
npm install

echo.
echo Installation complete!
echo.
echo Run 'npm run dev' to start the development server.
pause