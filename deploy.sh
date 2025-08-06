#!/bin/bash

# GenAI Career Copilot Deployment Script

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    exit 1
fi

echo "✅ Environment variables checked"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build frontend for production
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"

# Instructions for deployment
echo ""
echo "🎯 Deployment Instructions:"
echo ""
echo "Backend Deployment (Choose one):"
echo "1. Render: Connect your GitHub repo and deploy the backend folder"
echo "2. Railway: railway login && railway deploy"
echo "3. AWS Lambda: Use serverless framework or AWS SAM"
echo ""
echo "Frontend Deployment:"
echo "1. Vercel: vercel --prod (from frontend directory)"
echo "2. Netlify: netlify deploy --prod --dir=build"
echo ""
echo "Environment Variables to set in production:"
echo "- OPENAI_API_KEY=your_openai_api_key"
echo "- MONGODB_URL=your_mongodb_connection_string (optional)"
echo "- REACT_APP_API_URL=your_backend_url"
echo ""
echo "🎉 Ready for deployment!"