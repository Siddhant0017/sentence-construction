import React, { useState, useEffect } from "react";
import { ArrowRight, XCircle } from "lucide-react";
import { useQuestionData } from "./DataService";
import { useTimer, TimerDisplay } from "./Timer";
import StartPage from "./StartPage";
import ScoreCard from "./ScoreCard";

const SentenceExercise = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filledBlanks, setFilledBlanks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const [showStartPage, setShowStartPage] = useState(true);

  const { data, loading } = useQuestionData();
  const { timeLeft, resetTimer, formatTime } = useTimer(30);

  // Initialize blanks when data is loaded or question changes
  useEffect(() => {
    if (!loading && data && data.data && data.data.questions && data.data.questions.length > 0) {
      try {
        const blankCount = (data.data.questions[currentQuestionIndex].question.match(/_{10,}/g) || []).length;
        setFilledBlanks(Array(blankCount).fill(null));
        setSelectedOptions([]);
      } catch (error) {
        console.error("Error initializing blanks:", error);
      }
    }
  }, [currentQuestionIndex, loading, data]);

  const handleOptionClick = (option) => {
    console.log("Option clicked:", option);
    // Find the first empty blank
    const emptyBlankIndex = filledBlanks.findIndex((blank) => blank === null);
    if (emptyBlankIndex !== -1) {
      const newFilledBlanks = [...filledBlanks];
      newFilledBlanks[emptyBlankIndex] = option;
      setFilledBlanks(newFilledBlanks);
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleBlankClick = (index) => {
    console.log("Blank clicked:", index);
    if (filledBlanks[index] !== null) {
      const option = filledBlanks[index];
      const newFilledBlanks = [...filledBlanks];
      newFilledBlanks[index] = null;
      setFilledBlanks(newFilledBlanks);

      if (option) {
        setSelectedOptions(selectedOptions.filter((selected) => selected !== option));
      }
    }
  };

  // Add a useEffect to watch the timer and move to next question when it reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !showStartPage && !isCompleted) {
      // Time's up, move to next question
      handleNextQuestion();
    }
  }, [timeLeft, showStartPage, isCompleted]);

 
  
  // Modify handleNextQuestion to update streak
  const handleNextQuestion = () => {
    // If not all blanks are filled when time runs out, fill them with empty values
    if (filledBlanks.some(blank => blank === null)) {
      const completedBlanks = [...filledBlanks];
      for (let i = 0; i < completedBlanks.length; i++) {
        if (completedBlanks[i] === null) {
          completedBlanks[i] = ""; // Empty string for unanswered blanks
        }
      }
      setFilledBlanks(completedBlanks);
    }

    // Calculate score for this question
    let correctCount = 0;
    filledBlanks.forEach((blank, index) => {
      if (blank === data.data.questions[currentQuestionIndex].correctAnswer[index]) {
        correctCount++;
      }
    });

    const questionScore = Math.round((correctCount / filledBlanks.length) * 100);
    
    // Store question result for scorecard
    const questionResult = {
      question: data.data.questions[currentQuestionIndex].question,
      userAnswers: [...filledBlanks],
      correctAnswers: [...data.data.questions[currentQuestionIndex].correctAnswer],
      score: questionScore,
      isCorrect: correctCount === filledBlanks.length
    };
    setQuestionResults([...questionResults, questionResult]);

    if (currentQuestionIndex < data.data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setScore((prevScore) => prevScore + questionScore);
      resetTimer(30); // Reset timer when moving to the next question
    } else {
      // Final score calculation
      const finalScore = Math.round((score + questionScore) / data.data.questions.length);
      setScore(finalScore);
      setIsCompleted(true);
    }
  };

  const renderQuestion = () => {
    if (!data || !data.data || !data.data.questions || data.data.questions.length === 0) {
      return <div>No question data available</div>;
    }
    
    // Split the question by the blank placeholders
    const parts = data.data.questions[currentQuestionIndex].question.split(/_{10,}/);

    return (
      <div className="text-lg leading-relaxed mb-8">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span
                className={`inline-block border-b-2 border-gray-300 px-16 mx-1 cursor-pointer ${
                  filledBlanks[index] ? "bg-gray-50" : ""
                }`}
                onClick={() => handleBlankClick(index)}
              >
                {filledBlanks[index] || ""}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const handleStartExercise = () => {
    setShowStartPage(false);
    resetTimer(30);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestionResults([]);
  };

  const handleTryAgain = () => {
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    resetTimer(30);
    setQuestionResults([]);
  };

  const handleBackToStart = () => {
    setShowStartPage(true);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    resetTimer(30);
    setQuestionResults([]);
  };

  // Start page component
  if (showStartPage) {
    return (
      <StartPage 
        onStart={handleStartExercise} 
        onBack={() => {/* Back functionality */}} 
        questionCount={loading ? null : data?.data?.questions?.length}
      />
    );
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!data || !data.data || !data.data.questions) return <div className="text-center py-10">No data available</div>;

  const currentQuestion = data.data.questions[currentQuestionIndex];
  const availableOptions = currentQuestion.options.filter((option) => !selectedOptions.includes(option));

  if (isCompleted) {
    return (
      <ScoreCard 
        score={score} 
        questionResults={questionResults} 
        onTryAgain={handleTryAgain} 
        onBackToStart={handleBackToStart} 
      />
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <TimerDisplay timeLeft={timeLeft} formatTime={formatTime} />
          <button 
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => setShowStartPage(true)}
          >
            <XCircle className="mr-2 text-gray-500" size={18} />
            Quit
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex mb-10">
          {data.data.questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 mx-0.5 rounded-full ${
                index === currentQuestionIndex
                  ? "bg-indigo-500"
                  : index < currentQuestionIndex
                    ? "bg-indigo-200"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl text-gray-700 font-medium">Select the missing words in the correct order</h2>
          <p className="text-gray-500 text-sm mt-1">Question {currentQuestionIndex + 1} of {data.data.questions.length}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          {renderQuestion()}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {availableOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={filledBlanks.some((blank) => blank === null)}
            className={`p-3 rounded-md ${
              filledBlanks.some((blank) => blank === null)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            } transition-colors`}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentenceExercise;
