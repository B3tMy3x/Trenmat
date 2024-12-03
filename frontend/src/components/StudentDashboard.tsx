import { useEffect, useState } from "react";
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
import apiClient from "../apiClient";

export interface Homework {
  id: string;
  test_name: string;
  hand_in_by_date: string;
  completed_by: number;
  multiple_attempts: boolean;
  number_of_questions: number;
  time_to_answer: number;
}

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

  const [assignments, setAssignments] = useState<Homework[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteCode, setInviteCode] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/homeworks", {
          headers: { token },
        });
        setAssignments(response.data.homeworks);
      } catch (err) {
        setError("Ошибка при загрузке заданий");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

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

  const handleStartAssignment = (assignment: Homework) => {
    setShowConfirmModal({
      id: assignment.id,
      title: assignment.test_name,
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

  const handleConfirm = async () => {
    if (!showConfirmModal) return;

    if (showConfirmModal.type === "assignment") {
      const assignment = assignments.find((a) => a.id === showConfirmModal.id);
      try {
        const token = localStorage.getItem("token");
        await apiClient.post(
          `/start_homework/${assignment?.id}`,
          {},
          {
            headers: { token },
          }
        );
        setActiveTest({
          mode: "assignment",
          id: assignment?.id,
          timePerQuestion: assignment?.time_to_answer,
          totalQuestions: assignment?.number_of_questions,
        });
      } catch (error) {
        console.error("Error starting assignment:", error);
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        await apiClient.post(
          "/start_practice",
          {},
          {
            headers: { token },
          }
        );
        setActiveTest({
          mode: "practice",
          timePerQuestion: 10,
        });
      } catch (error) {
        console.error("Error starting practice:", error);
      }
    }
    setShowConfirmModal(null);
  };
  const handleJoinClass = async () => {
    try {
      const token = localStorage.getItem("token");

      await apiClient.get(`/join/class/${inviteCode}`, {
        headers: { token },
      });

      setSuccessMessage("Вы успешно присоединились к классу!");

      setInviteCode("");

      setShowInviteModal(false);
    } catch (error) {
      console.error("Ошибка при присоединении к классу:", error);

      setSuccessMessage(
        "Не удалось присоединиться к классу. Попробуйте еще раз."
      );
    }
  };
  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setActiveTest(null);
  };
  const openInviteModal = () => {
    setShowInviteModal(true);
  };
  const closeInviteModal = () => {
    setShowInviteModal(false);

    setInviteCode("");

    setSuccessMessage("");
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

      <button onClick={openInviteModal} className="btn-primary mb-4">
        Присоединиться к классу
      </button>

      {successMessage && (
        <div className="p-4 mb-4 text-green-800 bg-green-200 rounded-lg">
          {successMessage}
        </div>
      )}
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
      {showInviteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Введите код приглашения
            </h2>

            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Код приглашения"
            />

            <button onClick={handleJoinClass} className="btn-primary">
              Присоединиться
            </button>

            <button onClick={closeInviteModal} className="btn-secondary ml-2">
              Отмена
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          title={`Start ${showConfirmModal.title}`}
          message={`Are you ready to begin ${showConfirmModal.type === "assignment" ? "this assignment" : "your practice session"}?`}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(null)}
        />
      )}
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
            {loading ? (
              <div>Загрузка...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              assignments
                .filter((a) => !a.completed_by)
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="dark:text-white block">
                          {assignment.test_name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Due: {assignment.hand_in_by_date}
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
                ))
            )}
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
            {[...assignments.filter((a) => a.completed_by), ...practiceHistory]
              .sort((a, b) => {
                const dateA =
                  "hand_in_by_date" in a ? a.hand_in_by_date : a.date;
                const dateB =
                  "hand_in_by_date" in b ? b.hand_in_by_date : b.date;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              })
              .map((item) => (
                <div
                  key={
                    "hand_in_by_date" in item
                      ? `assignment-${item.id}`
                      : `practice-${item.id}`
                  }
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {"hand_in_by_date" in item ? (
                        <BookOpen className="text-green-600 dark:text-green-400" />
                      ) : (
                        <Brain className="text-purple-600 dark:text-purple-400" />
                      )}
                      <div>
                        <span className="dark:text-white block">
                          {"hand_in_by_date" in item
                            ? item.test_name
                            : `${item.topic} Practice`}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {"hand_in_by_date" in item
                            ? item.hand_in_by_date
                            : item.date}
                        </span>
                      </div>
                    </div>
                    {"multiple_attempts" in item && item.multiple_attempts ? (
                      <button
                        onClick={() => handleStartAssignment(item)}
                        className="btn-secondary text-sm"
                      >
                        Retry
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {"completed_by" in item
                          ? `${((item.completed_by / item.number_of_questions) * 100).toFixed(0)}%`
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
