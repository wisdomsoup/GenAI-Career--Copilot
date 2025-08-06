from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
from typing import Dict, List
import openai
from dotenv import load_dotenv
import pdfplumber
import docx2txt
import json
import numpy as np
import faiss
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

app = FastAPI(title="GenAI Career Copilot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://localhost:3000",
        "https://*.vercel.app",
        "https://*.netlify.app",
        "*"  # Allow all origins for production (you can restrict this later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ResumeAnalyzer:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        return docx2txt.process(file_path)
    
    def analyze_resume(self, resume_text: str) -> Dict:
        """Analyze resume using OpenAI GPT-4"""
        prompt = f"""
        Analyze the following resume and provide detailed feedback in JSON format:

        Resume Text:
        {resume_text}

        Please provide analysis in the following JSON structure:
        {{
            "bullet_point_fixes": [
                {{
                    "original": "original bullet point",
                    "improved": "improved version",
                    "reason": "explanation for improvement"
                }}
            ],
            "skill_suggestions": [
                {{
                    "skill": "skill name",
                    "category": "technical/soft",
                    "reason": "why this skill is important"
                }}
            ],
            "ats_optimization": [
                {{
                    "issue": "ATS issue identified",
                    "solution": "how to fix it",
                    "priority": "high/medium/low"
                }}
            ],
            "overall_score": 85,
            "summary": "Overall assessment of the resume"
        }}

        Focus on:
        1. Making bullet points more impactful with quantifiable results
        2. Identifying missing technical and soft skills
        3. Ensuring ATS compatibility (keywords, formatting, etc.)
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert resume reviewer and career coach."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result = response.choices[0].message.content
            return json.loads(result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

class JobMatcher:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.jobs_data = self.load_jobs_data()
        self.job_embeddings = None
        self.faiss_index = None
        self.initialize_embeddings()
    
    def load_jobs_data(self):
        """Load job descriptions from JSON file"""
        try:
            # Try multiple paths for the jobs data
            possible_paths = [
                '../data/sample_jobs.json',
                './data/sample_jobs.json',
                'data/sample_jobs.json',
                os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_jobs.json')
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    with open(path, 'r') as f:
                        return json.load(f)
            
            # If no file found, use fallback data
            raise FileNotFoundError("No jobs data file found")
            
        except FileNotFoundError:
            # Fallback to comprehensive inline data
            return [
                {
                    "id": 1,
                    "title": "Senior Software Engineer",
                    "company": "TechCorp Inc.",
                    "location": "San Francisco, CA",
                    "description": "We are seeking a Senior Software Engineer to join our dynamic team. The ideal candidate will have 5+ years of experience in full-stack development with expertise in React, Node.js, and cloud technologies. Responsibilities include designing scalable systems, mentoring junior developers, and collaborating with cross-functional teams to deliver high-quality software solutions.",
                    "requirements": [
                        "Bachelor's degree in Computer Science or related field",
                        "5+ years of software development experience",
                        "Proficiency in JavaScript, React, Node.js",
                        "Experience with AWS or other cloud platforms",
                        "Strong problem-solving and communication skills"
                    ],
                    "skills": ["JavaScript", "React", "Node.js", "AWS", "MongoDB", "Docker", "Git"]
                },
                {
                    "id": 2,
                    "title": "Data Scientist",
                    "company": "DataTech Solutions",
                    "location": "New York, NY",
                    "description": "Join our data science team to build machine learning models and extract insights from large datasets. You'll work on predictive analytics, recommendation systems, and data visualization projects. The role requires strong statistical knowledge and programming skills in Python and R.",
                    "requirements": [
                        "Master's degree in Data Science, Statistics, or related field",
                        "3+ years of experience in data science or analytics",
                        "Proficiency in Python, R, SQL",
                        "Experience with machine learning frameworks",
                        "Strong statistical analysis skills"
                    ],
                    "skills": ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "Pandas", "Scikit-learn", "Statistics"]
                },
                {
                    "id": 3,
                    "title": "DevOps Engineer",
                    "company": "CloudFirst Technologies",
                    "location": "Austin, TX",
                    "description": "We're looking for a DevOps Engineer to help automate our infrastructure and deployment processes. You'll work with containerization, CI/CD pipelines, and cloud infrastructure management. Experience with Kubernetes, Docker, and infrastructure as code is essential.",
                    "requirements": [
                        "Bachelor's degree in Engineering or related field",
                        "4+ years of DevOps or infrastructure experience",
                        "Experience with Kubernetes, Docker, Jenkins",
                        "Knowledge of AWS/Azure/GCP",
                        "Scripting skills in Python or Bash"
                    ],
                    "skills": ["Kubernetes", "Docker", "Jenkins", "AWS", "Terraform", "Python", "Bash", "CI/CD"]
                },
                {
                    "id": 4,
                    "title": "Frontend Developer",
                    "company": "UX Innovations",
                    "location": "Seattle, WA",
                    "description": "Join our frontend team to create beautiful and responsive user interfaces. You'll work with modern JavaScript frameworks, collaborate with designers, and ensure optimal user experience across all devices. Strong attention to detail and design sense required.",
                    "requirements": [
                        "Bachelor's degree or equivalent experience",
                        "3+ years of frontend development experience",
                        "Expertise in HTML, CSS, JavaScript",
                        "Experience with React or Vue.js",
                        "Understanding of responsive design principles"
                    ],
                    "skills": ["HTML", "CSS", "JavaScript", "React", "Vue.js", "SASS", "Webpack", "Responsive Design"]
                },
                {
                    "id": 5,
                    "title": "Product Manager",
                    "company": "InnovateTech",
                    "location": "Boston, MA",
                    "description": "Lead product strategy and development for our SaaS platform. You'll work closely with engineering, design, and sales teams to define product roadmaps, gather requirements, and ensure successful product launches. Strong analytical and communication skills are essential.",
                    "requirements": [
                        "MBA or equivalent experience",
                        "5+ years of product management experience",
                        "Experience with SaaS products",
                        "Strong analytical and communication skills",
                        "Understanding of agile development processes"
                    ],
                    "skills": ["Product Strategy", "Agile", "Analytics", "User Research", "Roadmapping", "Stakeholder Management"]
                }
            ]
    
    def get_embedding(self, text: str):
        """Get OpenAI embedding for text"""
        try:
            response = self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return None
    
    def initialize_embeddings(self):
        """Initialize FAISS index with job embeddings"""
        job_texts = []
        for job in self.jobs_data:
            job_text = f"{job['title']} {job['description']} {' '.join(job.get('skills', []))}"
            job_texts.append(job_text)
        
        # Get embeddings for all jobs
        embeddings = []
        for text in job_texts:
            embedding = self.get_embedding(text)
            if embedding:
                embeddings.append(embedding)
        
        if embeddings:
            self.job_embeddings = np.array(embeddings).astype('float32')
            
            # Create FAISS index
            dimension = self.job_embeddings.shape[1]
            self.faiss_index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(self.job_embeddings)
            self.faiss_index.add(self.job_embeddings)
    
    def find_matching_jobs(self, resume_text: str, top_k: int = 5):
        """Find top matching jobs for resume"""
        if not self.faiss_index:
            return []
        
        # Get resume embedding
        resume_embedding = self.get_embedding(resume_text)
        if not resume_embedding:
            return []
        
        # Normalize and search
        resume_embedding = np.array([resume_embedding]).astype('float32')
        faiss.normalize_L2(resume_embedding)
        
        scores, indices = self.faiss_index.search(resume_embedding, min(top_k, len(self.jobs_data)))
        
        # Format results
        matches = []
        for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
            if idx < len(self.jobs_data):
                job = self.jobs_data[idx]
                matches.append({
                    "job": job,
                    "similarity_score": float(score),
                    "rank": i + 1
                })
        
        return matches
    
    def explain_job_match(self, resume_text: str, job_data: dict, similarity_score: float):
        """Use GPT to explain why a job is a good match"""
        prompt = f"""
        Analyze why this job is a good match for the candidate based on their resume.
        
        Resume Summary: {resume_text[:1000]}...
        
        Job Details:
        Title: {job_data['title']}
        Company: {job_data['company']}
        Description: {job_data['description']}
        Required Skills: {', '.join(job_data.get('skills', []))}
        
        Similarity Score: {similarity_score:.2f}
        
        Provide a brief explanation (2-3 sentences) covering:
        1. Why this is a good match
        2. Key skills that align
        3. Any potential gaps or areas for improvement
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a career counselor explaining job matches."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Match score: {similarity_score:.2f}. This role aligns with your background."

analyzer = ResumeAnalyzer()
job_matcher = JobMatcher()

@app.get("/")
async def root():
    return {"message": "GenAI Career Copilot API is running!"}

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze uploaded resume file"""
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            resume_text = analyzer.extract_text_from_pdf(tmp_file_path)
        else:
            resume_text = analyzer.extract_text_from_docx(tmp_file_path)
        
        # Clean up temporary file
        os.unlink(tmp_file_path)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file")
        
        # Analyze resume
        analysis = analyzer.analyze_resume(resume_text)
        
        return JSONResponse(content={
            "success": True,
            "analysis": analysis,
            "extracted_text": resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
        })
        
    except Exception as e:
        # Clean up temporary file if it exists
        if 'tmp_file_path' in locals():
            try:
                os.unlink(tmp_file_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-jobs")
async def match_jobs(file: UploadFile = File(...)):
    """Find matching jobs for uploaded resume"""
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            resume_text = analyzer.extract_text_from_pdf(tmp_file_path)
        else:
            resume_text = analyzer.extract_text_from_docx(tmp_file_path)
        
        # Clean up temporary file
        os.unlink(tmp_file_path)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file")
        
        # Find matching jobs
        matches = job_matcher.find_matching_jobs(resume_text, top_k=5)
        
        # Add explanations for top matches
        for match in matches:
            match["explanation"] = job_matcher.explain_job_match(
                resume_text, 
                match["job"], 
                match["similarity_score"]
            )
        
        return JSONResponse(content={
            "success": True,
            "matches": matches,
            "total_jobs": len(job_matcher.jobs_data)
        })
        
    except Exception as e:
        # Clean up temporary file if it exists
        if 'tmp_file_path' in locals():
            try:
                os.unlink(tmp_file_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs")
async def get_all_jobs():
    """Get all available jobs"""
    return JSONResponse(content={
        "success": True,
        "jobs": job_matcher.jobs_data
    })

class InterviewAssistant:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.interview_roles = {
            "software_engineer": {
                "title": "Software Engineer",
                "behavioral_questions": [
                    "Tell me about a challenging project you worked on.",
                    "How do you handle tight deadlines?",
                    "Describe a time when you had to learn a new technology quickly."
                ],
                "technical_questions": [
                    "Explain the difference between REST and GraphQL APIs.",
                    "How would you optimize a slow database query?",
                    "What are the principles of clean code?"
                ]
            },
            "data_scientist": {
                "title": "Data Scientist",
                "behavioral_questions": [
                    "Tell me about a data project that didn't go as expected.",
                    "How do you communicate complex findings to non-technical stakeholders?",
                    "Describe your approach to feature selection."
                ],
                "technical_questions": [
                    "Explain the bias-variance tradeoff.",
                    "How would you handle missing data in a dataset?",
                    "What's the difference between supervised and unsupervised learning?"
                ]
            },
            "product_manager": {
                "title": "Product Manager",
                "behavioral_questions": [
                    "Tell me about a product decision you made that was unpopular.",
                    "How do you prioritize features when resources are limited?",
                    "Describe a time when you had to influence without authority."
                ],
                "technical_questions": [
                    "How would you measure the success of a new feature?",
                    "Walk me through how you would launch a new product.",
                    "How do you gather and prioritize user feedback?"
                ]
            }
        }
    
    def get_interview_question(self, role: str, question_type: str, question_number: int = 0):
        """Get a specific interview question"""
        if role not in self.interview_roles:
            return None
        
        role_data = self.interview_roles[role]
        questions = role_data.get(f"{question_type}_questions", [])
        
        if question_number < len(questions):
            return questions[question_number]
        return None
    
    def evaluate_answer(self, role: str, question: str, answer: str, question_type: str):
        """Evaluate interview answer using GPT-4"""
        role_title = self.interview_roles.get(role, {}).get("title", role)
        
        prompt = f"""
        You are an experienced interviewer for a {role_title} position. 
        
        Question asked: {question}
        Question type: {question_type}
        Candidate's answer: {answer}
        
        Please evaluate this answer and provide feedback in JSON format:
        {{
            "score": 85,
            "feedback": "Detailed feedback on the answer",
            "strengths": ["strength 1", "strength 2"],
            "improvements": ["improvement 1", "improvement 2"],
            "follow_up_question": "A relevant follow-up question"
        }}
        
        Score should be 0-100. Consider:
        - Clarity and structure of the answer
        - Relevance to the question
        - Technical accuracy (for technical questions)
        - Use of specific examples (for behavioral questions)
        - Communication skills
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"You are an expert interviewer for {role_title} positions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result = response.choices[0].message.content
            return json.loads(result)
        except Exception as e:
            return {
                "score": 50,
                "feedback": "Unable to evaluate answer at this time.",
                "strengths": [],
                "improvements": ["Please try again"],
                "follow_up_question": "Could you elaborate on your answer?"
            }

interview_assistant = InterviewAssistant()

@app.get("/interview/roles")
async def get_interview_roles():
    """Get available interview roles"""
    roles = []
    for role_key, role_data in interview_assistant.interview_roles.items():
        roles.append({
            "key": role_key,
            "title": role_data["title"],
            "behavioral_count": len(role_data["behavioral_questions"]),
            "technical_count": len(role_data["technical_questions"])
        })
    
    return JSONResponse(content={
        "success": True,
        "roles": roles
    })

@app.get("/interview/{role}/question")
async def get_interview_question(role: str, question_type: str, question_number: int = 0):
    """Get interview question for specific role"""
    question = interview_assistant.get_interview_question(role, question_type, question_number)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return JSONResponse(content={
        "success": True,
        "question": question,
        "question_type": question_type,
        "question_number": question_number,
        "role": role
    })

@app.post("/interview/evaluate")
async def evaluate_interview_answer(request: dict):
    """Evaluate interview answer"""
    role = request.get("role")
    question = request.get("question")
    answer = request.get("answer")
    question_type = request.get("question_type")
    
    if not all([role, question, answer, question_type]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    evaluation = interview_assistant.evaluate_answer(role, question, answer, question_type)
    
    return JSONResponse(content={
        "success": True,
        "evaluation": evaluation
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)