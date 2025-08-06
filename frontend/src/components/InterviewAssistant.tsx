import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Role {
  key: string;
  title: string;
  behavioral_count: number;
  technical_count: number;
}

interface Question {
  question: string;
  question_type: string;
  question_number: number;
  role: string;
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  follow_up_question: string;
}

const InterviewAssistant: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [questionType, setQuestionType] = useState<'behavioral' | 'technical'>('behavioral');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/interview/roles`
      );
      if (response.data.success) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchQuestion = async () => {
    if (!selectedRole) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/interview/${selectedRole}/question`,
        {
          params: {
            question_type: questionType,
            question_number: questionNumber
          }
        }
      );
      
      if (response.data.success) {
        setCurrentQuestion(response.data);
        setAnswer('');
        setEvaluation(null);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('No more questions available for this category.');
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/interview/evaluate`,
        {
          role: selectedRole,
          question: currentQuestion.question,
          answer: answer,
          question_type: questionType
        }
      );

      if (response.data.success) {
        setEvaluation(response.data.evaluation);
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    setQuestionNumber(prev => prev + 1);
    setEvaluation(null);
    fetchQuestion();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          AI Interview Assistant
        </h2>
        <p className="text-xl text-gray-600">
          Practice interviews with AI feedback for behavioral and technical questions.
        </p>
      </div>

      {/* Role Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Interview Role
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => {
                setSelectedRole(role.key);
                setQuestionNumber(0);
                setCurrentQuestion(null);
                setEvaluation(null);
              }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedRole === role.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{role.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {role.behavioral_count} behavioral + {role.technical_count} technical questions
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedRole && (
        <>
          {/* Question Type Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question Type
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setQuestionType('behavioral');
                  setQuestionNumber(0);
                  setCurrentQuestion(null);
                  setEvaluation(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  questionType === 'behavioral'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Behavioral Questions
              </button>
              <button
                onClick={() => {
                  setQuestionType('technical');
                  setQuestionNumber(0);
                  setCurrentQuestion(null);
                  setEvaluation(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  questionType === 'technical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Technical Questions
              </button>
            </div>
            
            <div className="mt-4">
              <button
                onClick={fetchQuestion}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Question
              </button>
            </div>
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interview Question
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {questionType} #{questionNumber + 1}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800 font-medium">
                  {currentQuestion.question}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer:
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your answer here..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                  
                  {evaluation && (
                    <button
                      onClick={nextQuestion}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Evaluation Results
                </h3>
                <div className={`px-4 py-2 rounded-full font-medium ${getScoreColor(evaluation.score)}`}>
                  Score: {evaluation.score}/100
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Feedback:</h4>
                  <p className="text-blue-800">{evaluation.feedback}</p>
                </div>

                {evaluation.strengths.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Strengths:</h4>
                    <ul className="list-disc list-inside text-green-800 space-y-1">
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.improvements.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-yellow-800 space-y-1">
                      {evaluation.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.follow_up_question && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Follow-up Question:</h4>
                    <p className="text-purple-800">{evaluation.follow_up_question}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewAssistant;