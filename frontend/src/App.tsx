import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogIn,
  GraduationCap,
  BookOpen,
  Users,
  Brain,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthModal } from "./components/AuthModal";
import { InfoModal } from "./components/InfoModal";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { ProfileDropdown } from "./components/ProfileDropdown";
import apiClient from "./apiClient";
import { User } from "./types";

const App: React.FC = () => {
  const { t } = useTranslation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await apiClient.get("/statistics", {
        headers: { token },
      });

      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Ошибка при проверке токена:", error);

      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: t("home.features.smartLearning.title"),
      description: t("home.features.smartLearning.description"),
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t("home.features.richContent.title"),
      description: t("home.features.richContent.description"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("home.features.collaborative.title"),
      description: t("home.features.collaborative.description"),
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t("home.features.aiPowered.title"),
      description: t("home.features.aiPowered.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="nav-container">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=64&h=64&fit=crop&crop=entropy"
              alt="Logo"
              className="w-9 h-9 rounded-xl shadow-md"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              EduPlatform
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            {user ? (
              <ProfileDropdown
                user={user}
                onLogout={() => {
                  setUser(null);
                  localStorage.removeItem("token");
                }}
              />
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={toggleAuthModal}
                className="btn-primary"
              >
                <LogIn size={20} />
                {t("common.signIn")}
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {!user ? (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 md:py-24"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                  {t("home.hero.title")}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {t("home.hero.subtitle")}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={toggleAuthModal}
                  className="btn-primary text-lg px-8 py-3"
                >
                  {t("common.getStarted")}
                </button>
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="btn-secondary text-lg px-8 py-3"
                >
                  {t("common.learnMore")}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="py-16 text-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Sparkles className="w-8 h-8 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">10k+</div>
                  <div className="text-blue-100">Активных студентов</div>
                </div>
                <div className="card p-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <BookOpen className="w-8 h-8 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-purple-100">Интерактивных курсов</div>
                </div>
                <div className="card p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <GraduationCap className="w-8 h-8 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="text-blue-100">Успешность обучения</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="py-16 text-center"
            >
              <div className="card p-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Готовы начать обучение?
                </h2>
                <p className="text-lg mb-8 text-blue-100">
                  Присоединяйтесь к тысячам студентов, которые уже учатся на
                  нашей платформе
                </p>
                <button
                  onClick={toggleAuthModal}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {t("common.getStarted")}
                </button>
              </div>
            </motion.div>
          </div>
        ) : user.role === "teacher" ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(userData) => {
          setUser(userData);
          localStorage.setItem("token", userData.token);
        }}
      />
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
    </div>
  );
};

export default App;
