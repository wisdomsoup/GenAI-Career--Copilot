@echo off
echo 🚀 Deploying GenAI Career Copilot to Production...
echo.

echo ✅ Prerequisites Check:
echo 1. Make sure you have your OpenAI API key ready
echo 2. Create accounts on Render.com and Vercel.com
echo 3. Install Vercel CLI: npm install -g vercel
echo.

echo 📋 Deployment Steps:
echo.

echo 🔧 STEP 1: Deploy Backend to Render
echo 1. Go to https://render.com and sign up/login
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub repository
echo 4. Select the backend folder as root directory
echo 5. Use these settings:
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
echo    - Environment: Python 3
echo 6. Add environment variable: OPENAI_API_KEY = your_api_key
echo 7. Deploy and copy the URL (e.g., https://your-app.onrender.com)
echo.

echo 🌐 STEP 2: Deploy Frontend to Vercel
echo 1. Open terminal in frontend directory
echo 2. Run: vercel login
echo 3. Run: vercel --prod
echo 4. Set environment variable: REACT_APP_API_URL = your_backend_url
echo 5. Your app will be live at: https://your-app.vercel.app
echo.

echo 🎯 STEP 3: Test Your Deployment
echo 1. Visit your Vercel URL
echo 2. Try uploading a resume
echo 3. Test job matching feature
echo 4. Try interview assistant
echo.

echo ⚡ Quick Deploy Commands:
echo.
echo For Backend (after setting up Render):
echo   git add .
echo   git commit -m "Deploy to production"
echo   git push origin main
echo.
echo For Frontend:
echo   cd frontend
echo   vercel --prod
echo.

pause