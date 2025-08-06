@echo off
echo 🚀 Setting up GenAI Career Copilot...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Setup backend
echo.
echo 📦 Setting up backend...
cd backend
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and add your OPENAI_API_KEY
)
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Setup frontend
echo.
echo 📦 Setting up frontend...
cd frontend
if not exist .env (
    copy .env.example .env
)
npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo 🎯 Next steps:
echo 1. Edit backend\.env and add your OPENAI_API_KEY
echo 2. Run the backend: cd backend && python -m uvicorn main:app --reload
echo 3. Run the frontend: cd frontend && npm start
echo 4. Open http://localhost:3000 in your browser
echo.
echo 🧪 To test the API: python test_api.py
echo.
pause