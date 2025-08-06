import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import AnalysisResults from './components/AnalysisResults';
import JobMatching from './components/JobMatching';
import InterviewAssistant from './components/InterviewAssistant';
import { AnalysisData } from './types';

type ActiveTab = 'resume' | 'jobs' | 'interview' | 'career';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('resume');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                GenAI Career Copilot
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('resume')}
                className={`font-medium ${
                  activeTab === 'resume' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Resume Analyzer
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`font-medium ${
                  activeTab === 'jobs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Job Matching
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`font-medium ${
                  activeTab === 'interview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Interview Prep
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`font-medium ${
                  activeTab === 'career' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Career Path
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'resume' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Resume Analysis
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your resume and get instant AI-powered feedback on bullet points, 
                skills, and ATS optimization to land your dream job.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <ResumeUpload 
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisStart={handleAnalysisStart}
                  isLoading={isLoading}
                />
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg text-gray-600">Analyzing your resume...</span>
                  </div>
                ) : analysisData ? (
                  <AnalysisResults data={analysisData} />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm">Upload a resume to see analysis results</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'jobs' && <JobMatching />}
        
        {activeTab === 'interview' && <InterviewAssistant />}
        
        {activeTab === 'career' && (
          <div className="text-center py-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Career Path Recommender
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Coming soon! Get personalized career guidance and skill gap analysis.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-yellow-800">
                This feature is under development. It will provide:
              </p>
              <ul className="mt-4 text-left text-yellow-700 space-y-2">
                <li>• Personalized career path recommendations</li>
                <li>• Skill gap analysis based on target roles</li>
                <li>• Learning resource suggestions</li>
                <li>• Industry trend insights</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;