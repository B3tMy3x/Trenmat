import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Clock, CheckCircle } from "lucide-react";
import apiClient from "../../apiClient";

interface TestCompleteProps {
  results: {
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    mode: "assignment" | "practice";
  };
  onRestart?: () => void;
  onClose?: () => void;
}

export function TestComplete({
  results,
  onRestart,
  onClose,
}: TestCompleteProps) {
  const accuracy = (results.correctAnswers / results.totalQuestions) * 100;
  const averageTime = results.timeSpent / results.totalQuestions;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto p-6"
    >
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2 dark:text-white">
          Test Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Here's how you did:
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accuracy
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {averageTime.toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Time
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {onRestart && (
            <button onClick={onRestart} className="btn-primary w-full">
              Try Again
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="btn-secondary w-full">
              Close
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}