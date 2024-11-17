import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface TestQuestion {
  question: string;
  correct_answer: string;
  options: string[];
}

interface TestRunnerProps {
  mode: "assignment" | "practice";
  timePerQuestion?: number;
  totalQuestions?: number;
  onComplete?: (results: TestResults) => void;
  onEndSession?: () => void;
}

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  mode: "assignment" | "practice";
}

export function TestRunner({
  mode,
  timePerQuestion = 10,
  totalQuestions = Infinity,
  onComplete,
  onEndSession,
}: TestRunnerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion | null>(
    null,
  );
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [results, setResults] = useState<TestResults>({
    totalQuestions: 0,
    correctAnswers: 0,
    timeSpent: 0,
    mode,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchQuestion = async () => {
    try {
      const mockQuestion: TestQuestion = {
        question: "Simplify sin²(x) + cos²(x)",
        correct_answer: "1",
        options: ["0", "1", "2", "sin(2x)"],
      };
      setCurrentQuestion(mockQuestion);
      setTimeLeft(timePerQuestion);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionNumber]);

  useEffect(() => {
    if (!showFeedback && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showFeedback]);

  const handleTimeout = () => {
    if (!selectedAnswer) {
      setShowFeedback(true);
      updateResults(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || !currentQuestion) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    updateResults(answer === currentQuestion.correct_answer);
  };

  const updateResults = (isCorrect: boolean) => {
    setResults((prev) => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      timeSpent: prev.timeSpent + (timePerQuestion - timeLeft),
      mode,
    }));
  };

  const handleNext = () => {
    if (questionNumber >= totalQuestions) {
      onComplete?.(results);
      return;
    }
    setQuestionNumber((prev) => prev + 1);
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {questionNumber}{" "}
          {mode === "assignment" && `of ${totalQuestions}`}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock
              size={16}
              className={
                timeLeft < 5
                  ? "text-red-500"
                  : "text-gray-600 dark:text-gray-400"
              }
            />
            <span
              className={
                timeLeft < 5
                  ? "text-red-500"
                  : "text-gray-600 dark:text-gray-400"
              }
            >
              {timeLeft}s
            </span>
          </div>
          {mode === "practice" && (
            <button onClick={onEndSession} className="btn-secondary text-sm">
              End Session
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <h2 className="text-xl font-semibold mb-6 dark:text-white">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                showFeedback
                  ? option === currentQuestion.correct_answer
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                    : option === selectedAnswer
                      ? "bg-red-100 dark:bg-red-900/30 border-red-500"
                      : "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              } border ${
                selectedAnswer === option
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">{option}</span>
                {showFeedback &&
                  (option === currentQuestion.correct_answer ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : option === selectedAnswer ? (
                    <XCircle className="text-red-500" size={20} />
                  ) : null)}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {showFeedback && (
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              Score:{" "}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {results.correctAnswers} / {results.totalQuestions} (
              {(
                (results.correctAnswers / results.totalQuestions) *
                100
              ).toFixed(1)}
              %)
            </span>
          </div>
          <button onClick={handleNext} className="btn-primary">
            {questionNumber >= totalQuestions ? "Finish" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}