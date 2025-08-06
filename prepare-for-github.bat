@echo off
echo 🚀 Preparing GenAI Career Copilot for GitHub Upload...
echo.

echo ✅ Checking project structure...
if exist "backend\main.py" (
    echo ✓ Backend files found
) else (
    echo ❌ Backend files missing
)

if exist "frontend\src\App.tsx" (
    echo ✓ Frontend files found
) else (
    echo ❌ Frontend files missing
)

if exist "README.md" (
    echo ✓ README.md found
) else (
    echo ❌ README.md missing
)

echo.
echo 📋 Files ready for upload:
echo ├── backend/              (FastAPI application)
echo ├── frontend/             (React application)
echo ├── data/                 (Sample job data)
echo ├── .github/workflows/    (CI/CD configuration)
echo ├── README.md             (Project documentation)
echo ├── DEPLOYMENT_GUIDE.md   (Deployment instructions)
echo ├── PROJECT_STATUS.md     (Project status)
echo └── setup.bat             (Setup script)
echo.

echo 🔧 Git commands to run:
echo.
echo 1. git init
echo 2. git remote add origin https://github.com/Brijes987/GenAI-Career--Copilot.git
echo 3. git add .
echo 4. git commit -m "Initial commit: Complete GenAI Career Copilot"
echo 5. git push -u origin main
echo.

echo 🎯 After upload, your repo will have:
echo - Complete full-stack AI application
echo - Production-ready deployment configuration
echo - Comprehensive documentation
echo - Professional README with all features
echo.

echo Ready to upload! Run the git commands above.
pause