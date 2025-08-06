# 🚀 GenAI Career Copilot

A full-stack, AI-powered career assistant that helps job seekers optimize their resumes, discover matching jobs, simulate interviews, and plan career growth — all using cutting-edge Generative AI.

## 🎯 Core Features

- **📄 Resume Analyzer**: AI-enhanced resume feedback with bullet point fixes, skill gap insights, and ATS optimization.
- **🔍 Smart Job Matching**: Matches your resume to job descriptions using OpenAI embeddings + FAISS vector search.
- **🎤 AI Interview Assistant**: Practice technical and behavioral interviews with real-time feedback and scoring.
- **🧭 Career Path Recommender**: (Coming Soon) Personalized growth roadmap and learning resource suggestions.

## 🧠 Tech Stack

| Layer | Tech Used |
|-------|-----------|
| **Frontend** | React.js + TypeScript + TailwindCSS |
| **Backend** | FastAPI (Python) |
| **AI/ML** | OpenAI GPT-4 + Embeddings API |
| **Vector DB** | FAISS |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend) + Render / Railway (Backend) |

## 📁 Project Structure

```
genai-career-copilot/
├── frontend/           # React + Tailwind frontend
├── backend/            # FastAPI backend with AI logic
├── data/               # Sample job descriptions
├── requirements.txt    # Python dependencies
└── README.md
```

## ⚙️ Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

**Backend (.env):**
```ini
OPENAI_API_KEY=your_openai_api_key
MONGODB_URL=your_mongodb_connection_string
```

**Frontend (.env):**
```ini
REACT_APP_API_URL=http://localhost:8000
```

## ✅ Features Implemented

### 📄 Resume Analyzer
- ✅ Upload PDF/DOCX resumes
- ✅ AI-generated bullet point improvements
- ✅ ATS optimization suggestions
- ✅ Missing skills and technologies
- ✅ Resume scoring and suggestions summary

### 🔍 Smart Job Matching
- ✅ Preloaded job dataset (5+ sample roles)
- ✅ Resume embedding + vector similarity search
- ✅ GPT-based explanations of best-fit matches

### 🎤 AI Interview Assistant
- ✅ Role-specific interviews (SWE, DS, PM)
- ✅ Behavioral and technical rounds
- ✅ Answer scoring, feedback, and tips
- ✅ Follow-up question suggestions

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze-resume` | Analyze uploaded resume |
| POST | `/match-jobs` | Find top job matches |
| GET | `/jobs` | List sample job descriptions |
| GET | `/interview/roles` | Get available interview roles |
| GET | `/interview/{role}/question` | Get next interview question |
| POST | `/interview/evaluate` | Score user response |

## 🌐 Deployment Instructions

### 🖥 Backend Deployment (Options)

**Render (Recommended)**
1. Connect GitHub to Render
2. Create new Web Service
3. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variable: `OPENAI_API_KEY`

**Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 🌐 Frontend Deployment

**Vercel (Recommended)**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=build
```

## 🌍 Environment Variables (Production)

| Service | Variable |
|---------|----------|
| **Backend** | `OPENAI_API_KEY`, `MONGODB_URL` |
| **Frontend** | `REACT_APP_API_URL=<Backend URL>` |

## 🧱 Architecture Overview

```
[React Frontend]
    ↓ REST API calls
[FastAPI Backend]
    ↓
[OpenAI GPT-4 APIs] ←→ [FAISS Vector Store]
    ↓
[MongoDB Atlas]
```

## 🚀 Quick Start

```bash
git clone https://github.com/Brijes987/GenAI-Career--Copilot.git
cd genai-career-copilot

# Setup Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload

# Setup Frontend
cd ../frontend
npm install
cp .env.example .env
npm start
```

## 📌 Roadmap

- ✅ Resume Analyzer
- ✅ Job Matching Engine
- ✅ AI Interview Assistant
- 🔜 Career Path Recommender
- ✅ Production Deployment

## 🤝 Contributing

PRs are welcome! Follow the steps:
1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push and submit a PR

## 📄 License

This project is licensed under the MIT License — feel free to use and modify for learning and development purposes.

## 🙌 Acknowledgements

- [OpenAI](https://openai.com)
- [FAISS](https://github.com/facebookresearch/faiss)
- [MongoDB Atlas](https://www.mongodb.com/atlas)