import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AnalysisData } from '../types';

interface ResumeUploadProps {
  onAnalysisComplete: (data: AnalysisData) => void;
  onAnalysisStart: () => void;
  isLoading: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ 
  onAnalysisComplete, 
  onAnalysisStart, 
  isLoading 
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    onAnalysisStart();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/analyze-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        onAnalysisComplete(response.data.analysis);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
      onAnalysisComplete({
        bullet_point_fixes: [],
        skill_suggestions: [],
        ats_optimization: [],
        overall_score: 0,
        summary: 'Analysis failed. Please try again.'
      });
    }
  }, [onAnalysisComplete, onAnalysisStart]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Your Resume
      </h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : isLoading
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {isLoading ? (
            <div>
              <p className="text-gray-500">Processing your resume...</p>
              <div className="mt-2 animate-pulse">
                <div className="h-2 bg-blue-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">Drop your resume here...</p>
          ) : (
            <div>
              <p className="text-gray-600 font-medium">
                Drag & drop your resume here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports PDF and DOCX files (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p className="font-medium mb-2">What we'll analyze:</p>
        <ul className="space-y-1 text-xs">
          <li>• Bullet point improvements with quantifiable results</li>
          <li>• Missing technical and soft skills</li>
          <li>• ATS optimization for better keyword matching</li>
          <li>• Overall resume score and recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;