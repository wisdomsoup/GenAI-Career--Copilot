@echo off
echo 🚀 Uploading GenAI Career Copilot to GitHub...
echo Repository: https://github.com/Brijes987/GenAI-Career--Copilot
echo.

echo 📋 Step 1: Initialize Git repository
git init
if errorlevel 1 (
    echo ❌ Git initialization failed. Make sure Git is installed.
    pause
    exit /b 1
)

echo ✅ Git repository initialized
echo.

echo 📋 Step 2: Add remote repository
git remote add origin https://github.com/Brijes987/GenAI-Career--Copilot.git
if errorlevel 1 (
    echo ⚠️  Remote already exists, updating...
    git remote set-url origin https://github.com/Brijes987/GenAI-Career--Copilot.git
)

echo ✅ Remote repository configured
echo.

echo 📋 Step 3: Add all files to staging
git add .
if errorlevel 1 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

echo ✅ All files staged for commit
echo.

echo 📋 Step 4: Create initial commit
git commit -m "🚀 Initial commit: Complete GenAI Career Copilot

✨ Features:
- Resume Analyzer with AI-powered feedback
- Smart Job Matching using OpenAI embeddings + FAISS
- AI Interview Assistant with real-time scoring
- Production-ready deployment configuration
- Comprehensive documentation

🛠️ Tech Stack:
- Frontend: React + TypeScript + TailwindCSS
- Backend: FastAPI + Python
- AI: OpenAI GPT-4 + Embeddings API
- Vector DB: FAISS
- Deployment: Vercel + Render

🎯 Ready for production deployment!"

if errorlevel 1 (
    echo ❌ Commit failed
    pause
    exit /b 1
)

echo ✅ Initial commit created
echo.

echo 📋 Step 5: Push to GitHub
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo ❌ Push failed. You may need to authenticate with GitHub.
    echo.
    echo 💡 Try one of these solutions:
    echo 1. Use GitHub Desktop for easier authentication
    echo 2. Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
    echo 3. Use personal access token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your GenAI Career Copilot has been uploaded to GitHub!
echo.
echo 🔗 Repository URL: https://github.com/Brijes987/GenAI-Career--Copilot
echo.
echo 📋 What's uploaded:
echo ✅ Complete full-stack application
echo ✅ AI-powered resume analysis
echo ✅ Smart job matching system
echo ✅ Interview assistant with scoring
echo ✅ Production deployment configuration
echo ✅ Comprehensive documentation
echo ✅ Professional README
echo.
echo 🚀 Next steps:
echo 1. Visit your GitHub repository to verify upload
echo 2. Deploy to production using DEPLOYMENT_GUIDE.md
echo 3. Add your OpenAI API key to deployment platforms
echo 4. Share your live application with employers!
echo.
pause