# 🚀 Production Deployment Guide

## Quick Deploy (5 minutes)

### Prerequisites
- [ ] OpenAI API key (get from https://platform.openai.com)
- [ ] GitHub account
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)

---

## 🔧 Step 1: Deploy Backend to Render

### Option A: One-Click Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Option B: Manual Deploy
1. **Fork/Clone this repository to your GitHub**
2. **Go to [Render.com](https://render.com) and sign up**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**
   ```
   Name: genai-career-copilot-api
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. **Add Environment Variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PYTHON_VERSION`: 3.9.18
7. **Click "Create Web Service"**
8. **Wait for deployment (3-5 minutes)**
9. **Copy your backend URL** (e.g., `https://genai-career-copilot-api.onrender.com`)

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/genai-career-copilot&project-name=genai-career-copilot&repository-name=genai-career-copilot)

### Option B: Manual Deploy
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variable:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

6. **Redeploy to apply environment variables:**
   ```bash
   vercel --prod
   ```

---

## 🎯 Step 3: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://genai-career-copilot.vercel.app`)
2. **Test Resume Analysis:**
   - Upload a PDF/DOCX resume
   - Verify AI analysis works
3. **Test Job Matching:**
   - Upload resume in Job Matching tab
   - Check if jobs are returned with explanations
4. **Test Interview Assistant:**
   - Select a role and question type
   - Submit an answer and verify feedback

---

## 🔧 Environment Variables Summary

### Backend (Render)
```env
OPENAI_API_KEY=sk-your-openai-api-key
PYTHON_VERSION=3.9.18
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 🚨 Troubleshooting

### Backend Issues
- **Build fails**: Check Python version and requirements.txt
- **API errors**: Verify OPENAI_API_KEY is set correctly
- **CORS errors**: Backend CORS is configured for all origins

### Frontend Issues
- **API calls fail**: Check REACT_APP_API_URL environment variable
- **Build fails**: Run `npm install` and check for missing dependencies

### Common Issues
- **OpenAI API errors**: Ensure you have credits in your OpenAI account
- **Slow responses**: OpenAI API can take 10-30 seconds for complex requests
- **File upload fails**: Check file size (max 10MB) and format (PDF/DOCX only)

---

## 💰 Cost Estimation

### Hosting Costs (Monthly)
- **Render (Backend)**: Free tier available, $7/month for paid
- **Vercel (Frontend)**: Free tier sufficient for most use cases
- **OpenAI API**: ~$5-20/month depending on usage

### Total: ~$0-30/month

---

## 🎉 Success!

Your GenAI Career Copilot is now live! Share your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.onrender.com`
- **API Docs**: `https://your-api.onrender.com/docs`

---

## 📈 Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **Monitoring**: Set up error tracking with Sentry
4. **Database**: Add MongoDB for user data persistence
5. **Authentication**: Add user accounts and login
6. **Rate Limiting**: Implement API rate limiting for production use

---

## 🔄 Updates & Maintenance

To update your deployment:
1. **Push changes to GitHub**
2. **Render**: Auto-deploys from main branch
3. **Vercel**: Auto-deploys from main branch

Both platforms support automatic deployments from your GitHub repository!