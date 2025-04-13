import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ScoreCard = ({ score, questionResults, onTryAgain, onBackToStart }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate the circumference and stroke-dashoffset for the progress circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white shadow-lg p-8 rounded-lg flex flex-col items-center border border-gray-100">
      {/* Score Circle */}
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f5f5f5" strokeWidth="12" />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-gray-800">{score}</span>
          <span className="text-gray-500 text-sm">Overall Score</span>
        </div>
      </div>

      {/* Feedback Message */}
      <div className="text-center mb-10 max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {score >= 80 ? "Excellent Work!" :
           score >= 60 ? "Good Job!" :
           score >= 40 ? "Nice Effort!" :
           "Keep Practicing!"}
        </h2>
        <p className="text-gray-600">
          {score >= 80 ? "You've mastered these sentence constructions!" :
           score >= 60 ? "You have a good understanding of sentence construction." :
           score >= 40 ? "You're showing real improvement." :
           "Your skills will only get stronger with more practice."}
        </p>
      </div>

      {/* Dashboard Button */}
      <div className="flex gap-4 mb-8">
        <button
          className="border border-indigo-500 text-indigo-600 px-6 py-3 rounded-md mb-6 hover:bg-indigo-50 transition-colors font-medium"
          onClick={onBackToStart}
        >
          Back to Start
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-md mb-6 hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          onClick={onTryAgain}
        >
          Try Again
        </button>
      </div>

      {/* Expand Details Button */}
      <button 
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 px-4 py-2 rounded-md"
        onClick={() => setShowDetails(!showDetails)}
      >
        <span>{showDetails ? "Hide Details" : "View Question Details"}</span>
        <ChevronDown className={`transform ${showDetails ? 'rotate-180' : ''} transition-transform`} />
      </button>

      {/* Details Section */}
      {showDetails && (
        <div className="w-full">
          <h3 className="text-xl font-medium mb-6 text-gray-700">Question Summary</h3>
          
          {questionResults.map((result, index) => {
            // Split the question by blanks to reconstruct with answers
            const parts = result.question.split(/_{10,}/);
            
            return (
              <div key={index} className="mb-8 border rounded-lg p-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-4 items-center">
                  <span className="text-gray-600 font-medium">Prompt {index + 1}</span>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">{index + 1}/{questionResults.length}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
                
                {/* Original question with correct answers */}
                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Correct sentence:</p>
                  <p className="text-gray-700">
                    {parts.map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < parts.length - 1 && (
                          <span className="underline font-medium text-green-600">
                            {result.correctAnswers[i]}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
                
                {/* User's answer section */}
                <div className="p-4 bg-white rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Your response:</p>
                  <p className="text-gray-700">
                    {parts.map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < parts.length - 1 && (
                          <span className={`underline font-medium ${
                            result.userAnswers[i] === result.correctAnswers[i] 
                              ? 'text-green-600' 
                              : 'text-red-500'
                          }`}>
                            {result.userAnswers[i]}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;