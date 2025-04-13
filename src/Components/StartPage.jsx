import React from "react";
import { Clock, Award, BookOpen, ChevronRight } from "lucide-react";

const StartPage = ({ onStart, onBack, questionCount }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-xl overflow-hidden border border-indigo-100">
      <div className="p-10 flex flex-col items-center">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-500 text-white p-4 rounded-full">
              <BookOpen size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-indigo-500 mb-3">Sentence Construction</h1>
          <p className="text-gray-600 max-w-md text-lg">
            Enhance your language skills by arranging words in the correct order to form meaningful sentences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
          <div className="text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex justify-center mb-3 text-indigo-500">
              <Clock size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Time Per Question</h3>
            <p className="text-indigo-600 font-medium text-xl">1 minute</p>
          </div>
          <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex justify-center mb-3 text-amber-600">
              <Award size={28} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Total Questions</h3>
            <p className="text-amber-600 font-medium text-xl">{questionCount || "..."}</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex justify-center mb-3 text-yellow-500">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Coins to Earn</h3>
            <p className="text-green-600 font-medium text-xl">20 coins</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex-1 flex items-center justify-center"
            onClick={onBack}
          >
            Back
          </button>
          <button 
            className="px-8 py-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md flex-1 flex items-center justify-center group"
            onClick={onStart}
          >
            Start Exercise
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Complete the exercise to earn coins and improve your language skills!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;