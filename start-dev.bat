@echo off
echo Starting Color Analysis App Development Server...

:: Kill any process running on port 3000 (default Next.js port)
echo Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Check if .env.local exists
if not exist .env.local (
    echo Error: .env.local file not found!
    echo Please create .env.local with your Firebase configuration
    pause
    exit
)

:: Install required packages
echo Installing required packages...
call npm install @radix-ui/react-collapsible framer-motion react-webcam react-image-crop

:: Install dependencies if needed
call npm install

:: Configure Firebase Storage CORS
echo Configuring Firebase Storage CORS...
echo [{ > cors.json
echo   "origin": ["http://localhost:3000"], >> cors.json
echo   "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"], >> cors.json
echo   "maxAgeSeconds": 3600, >> cors.json
echo   "responseHeader": [ >> cors.json
echo     "Content-Type", >> cors.json
echo     "Authorization", >> cors.json
echo     "Content-Length", >> cors.json
echo     "User-Agent", >> cors.json
echo     "X-Requested-With", >> cors.json
echo     "x-goog-resumable", >> cors.json
echo     "x-goog-meta-*" >> cors.json
echo   ] >> cors.json
echo }] >> cors.json

:: Check if Firebase CLI is installed and get bucket name
call firebase --version >nul 2>&1
if errorlevel 1 (
    echo Installing Firebase CLI globally...
    call npm install -g firebase-tools
)

:: Login to Firebase if needed
call firebase login --interactive

:: Get default bucket name
for /f "tokens=2 delims=:" %%a in ('firebase projects:list ^| findstr "Storage bucket"') do set "BUCKET_NAME=%%a"
set "BUCKET_NAME=%BUCKET_NAME: =%"

:: Set CORS configuration using gsutil
echo Setting CORS configuration...
call gsutil cors set cors.json gs://%BUCKET_NAME%
del cors.json

:: Start the development server
echo Starting Next.js development server...
call npm run dev

pause 