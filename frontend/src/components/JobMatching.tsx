import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { JobMatch } from '../types';

const JobMatching: React.FC = () => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setJobMatches([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/match-jobs`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setJobMatches(response.data.matches);
      } else {
        throw new Error('Job matching failed');
      }
    } catch (error) {
      console.error('Error matching jobs:', error);
      alert('Failed to match jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Job Matching
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your resume to find the most relevant job opportunities using AI-powered semantic matching.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Resume for Job Matching
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
                <p className="text-gray-500">Finding matching jobs...</p>
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
                  We'll find the best matching jobs for your profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {jobMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top Job Matches ({jobMatches.length})
          </h3>
          
          <div className="space-y-6">
            {jobMatches.map((match, index) => (
              <div key={match.job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                        #{match.rank}
                      </span>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {match.job.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">{match.job.company}</p>
                    {match.job.location && (
                      <p className="text-gray-500 text-sm">{match.job.location}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(match.similarity_score)}`}>
                    {(match.similarity_score * 100).toFixed(0)}% match
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {match.job.description}
                  </p>
                </div>

                {match.job.skills && match.job.skills.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {match.job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Why this is a good match:</h5>
                  <p className="text-blue-800 text-sm">{match.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatching;