import React, { useState } from 'react';
import { AnalysisData } from '../types';

interface AnalysisResultsProps {
  data: AnalysisData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'bullet' | 'skills' | 'ats'>('bullet');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Analysis Results
        </h3>
        <div className={`px-4 py-2 rounded-full ${getScoreBgColor(data.overall_score)}`}>
          <span className={`font-bold ${getScoreColor(data.overall_score)}`}>
            Score: {data.overall_score}/100
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Overall Assessment</h4>
        <p className="text-blue-800 text-sm">{data.summary}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bullet')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bullet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bullet Points ({data.bullet_point_fixes.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'skills'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Skills ({data.skill_suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ATS ({data.ats_optimization.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activeTab === 'bullet' && (
          <div className="space-y-4">
            {data.bullet_point_fixes.length > 0 ? (
              data.bullet_point_fixes.map((fix, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <h5 className="font-medium text-red-700 mb-1">Original:</h5>
                    <p className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                      {fix.original}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h5 className="font-medium text-green-700 mb-1">Improved:</h5>
                    <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                      {fix.improved}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-700 mb-1">Why:</h5>
                    <p className="text-sm text-gray-600">{fix.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No bullet point improvements suggested.
              </p>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-3">
            {data.skill_suggestions.length > 0 ? (
              data.skill_suggestions.map((skill, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{skill.skill}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.category === 'technical' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{skill.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No skill suggestions available.
              </p>
            )}
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="space-y-3">
            {data.ats_optimization.length > 0 ? (
              data.ats_optimization.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Issue:</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 bg-red-50 p-2 rounded">
                    {item.issue}
                  </p>
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Solution:</h5>
                    <p className="text-sm text-gray-600">{item.solution}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No ATS optimization issues found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;