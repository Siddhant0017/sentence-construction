import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const useTimer = (initialTime = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resetTimer = (newTime = initialTime) => {
    setTimeLeft(newTime);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return { timeLeft, resetTimer, formatTime };
};

export const TimerDisplay = ({ timeLeft, formatTime }) => {
  return (
    <div className="flex items-center text-2xl font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-md">
      <Clock className="mr-2 text-indigo-500" size={20} />
      {formatTime(timeLeft)}
    </div>
  );
};