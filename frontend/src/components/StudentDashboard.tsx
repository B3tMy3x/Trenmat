import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Award,
  Brain,
  History,
} from "lucide-react";
import { TestRunner } from "./test/TestRunner";
import { TestComplete } from "./test/TestComplete";
import { ConfirmModal } from "./modals/ConfirmModal";

export function StudentDashboard() {
  const [activeTest, setActiveTest] = useState<{
    mode: "assignment" | "practice";
    id?: string;
    timePerQuestion?: number;
    totalQuestions?: number;
  } | null>(null);

  const [testResults, setTestResults] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    id: string;
    title: string;
    type: "assignment" | "practice";
  } | null>(null);

  const assignments = [
    {
      id: "assignment-1",
      title: "Math Quiz",
      dueDate: "2024-03-20",
      completed: false,
      canBeResolved: true,
      totalQuestions: 10,
      timePerQuestion: 60,
      correctAnswers: 0,
    },
    {
      id: "assignment-2",
      title: "Science Test",
      dueDate: "2024-03-22",
      completed: true,
      canBeResolved: false,
      totalQuestions: 15,
      correctAnswers: 13,
    },
  ];

  const practiceHistory = [
    {
      id: "practice-1",
      date: "2024-03-15",
      topic: "Mathematics",
      score: 85,
      questionsAnswered: 20,
    },
    {
      id: "practice-2",
      date: "2024-03-14",
      topic: "Physics",
      score: 92,
      questionsAnswered: 15,
    },
  ];

  const practiceStats = {
    totalAttempts: 45,
    correctAnswers: 38,
    streakDays: 5,
  };

  const handleStartAssignment = (assignment: any) => {
    setShowConfirmModal({
      id: assignment.id,
      title: assignment.title,
      type: "assignment",
    });
  };

  const handleStartPractice = () => {
    setShowConfirmModal({
      id: "practice",
      title: "Practice Session",
      type: "practice",
    });
  };

  const handleConfirm = () => {
    if (!showConfirmModal) return;

    if (showConfirmModal.type === "assignment") {
      const assignment = assignments.find((a) => a.id === showConfirmModal.id);
      setActiveTest({
        mode: "assignment",
        id: assignment?.id,
        timePerQuestion: assignment?.timePerQuestion,
        totalQuestions: assignment?.totalQuestions,
      });
    } else {
      setActiveTest({
        mode: "practice",
        timePerQuestion: 10,
      });
    }
    setShowConfirmModal(null);
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setActiveTest(null);
  };

  if (activeTest) {
    return (
      <TestRunner
        mode={activeTest.mode}
        timePerQuestion={activeTest.timePerQuestion}
        totalQuestions={activeTest.totalQuestions}
        onComplete={handleTestComplete}
      />
    );
  }

  if (testResults) {
    return (
      <TestComplete
        results={testResults}
        onRestart={() => {
          setTestResults(null);
          setActiveTest({ mode: "practice", timePerQuestion: 10 });
        }}
        onClose={() => setTestResults(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
          Welcome Back, Student!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You're on a {practiceStats.streakDays}-day learning streak! 🔥
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Award className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">
              Overall Progress
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Practice Accuracy
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {(
                  (practiceStats.correctAnswers / practiceStats.totalAttempts) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${(practiceStats.correctAnswers / practiceStats.totalAttempts) * 100}%`,
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">
              Learning Stats
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Total Sessions
              </span>
              <span className="font-medium dark:text-white">
                {practiceStats.totalAttempts}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Correct Answers
              </span>
              <span className="font-medium dark:text-white">
                {practiceStats.correctAnswers}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <History className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-2">
            {practiceHistory.slice(0, 2).map((session) => (
              <div
                key={session.id}
                className="text-sm py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {session.topic}
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {session.score}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="text-blue-600 dark:text-blue-400" />
            </div>
            Pending Assignments
          </h2>

          <div className="space-y-4">
            {assignments
              .filter((a) => !a.completed)
              .map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-600 dark:text-blue-400" />
                    <div>
                      <span className="dark:text-white block">
                        {assignment.title}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-primary text-sm"
                    onClick={() => handleStartAssignment(assignment)}
                  >
                    Start Now
                  </button>
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="text-green-600 dark:text-green-400" />
            </div>
            Session History
          </h2>

          <div className="space-y-4">
            {[...assignments.filter((a) => a.completed), ...practiceHistory]
              .sort((a, b) => {
                const dateA = "dueDate" in a ? a.dueDate : a.date;
                const dateB = "dueDate" in b ? b.dueDate : b.date;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              })
              .map((item) => (
                <div
                  key={
                    "dueDate" in item
                      ? `assignment-${item.id}`
                      : `practice-${item.id}`
                  }
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {"dueDate" in item ? (
                        <BookOpen className="text-green-600 dark:text-green-400" />
                      ) : (
                        <Brain className="text-purple-600 dark:text-purple-400" />
                      )}
                      <div>
                        <span className="dark:text-white block">
                          {"dueDate" in item
                            ? item.title
                            : `${item.topic} Practice`}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {"dueDate" in item ? item.dueDate : item.date}
                        </span>
                      </div>
                    </div>
                    {"canBeResolved" in item && item.canBeResolved ? (
                      <button
                        onClick={() => handleStartAssignment(item)}
                        className="btn-secondary text-sm"
                      >
                        Retry
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {"correctAnswers" in item
                          ? `${((item.correctAnswers / item.totalQuestions) * 100).toFixed(0)}%`
                          : `${item.score}%`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 card p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Play className="text-white" />
          </div>
          Practice Mode
        </h2>
        <p className="mb-6 text-white/90">
          Challenge yourself with interactive practice sessions. Your current
          accuracy is{" "}
          <span className="font-bold">
            {(
              (practiceStats.correctAnswers / practiceStats.totalAttempts) *
              100
            ).toFixed(1)}
            %
          </span>
        </p>
        <button
          className="bg-white text-purple-600 hover:bg-white/90 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          onClick={handleStartPractice}
        >
          <Play size={18} />
          Start Practice Session
        </button>
      </motion.div>

      {showConfirmModal && (
        <ConfirmModal
          title={`Start ${showConfirmModal.title}`}
          message={`Are you ready to begin ${showConfirmModal.type === "assignment" ? "this assignment" : "your practice session"}?`}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(null)}
        />
      )}
    </div>
  );
}
