import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, UserCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import authClient from "../authClient";
interface AuthForm {
  email: string;
  password: string;
  role?: "student" | "teacher";
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const { register, handleSubmit, reset } = useForm<AuthForm>();
  const [isLogin, setIsLogin] = useState(false);

  const onSubmit = async (data: AuthForm) => {
    try {
      let response;
      if (isLogin) {
        response = await authClient.post("/login", {
          email: data.email,
          password: data.password,
          role: data.role || "student",
        });
      } else {
        response = await authClient.post("/register", {
          email: data.email,
          password: data.password,
          role: data.role || "student",
        });
      }

      if (isLogin) {
        const { access_token } = response.data;
        onLogin({ token: access_token, ...data });
      } else {
        alert("Registration successful! Please log in.");
        toggleMode();
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Failed to authenticate. Please check your credentials.");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isLogin ? "С возвращением!" : "Создать аккаунт"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {isLogin
                  ? "Войдите, чтобы продолжить"
                  : "Зарегистрируйтесь, чтобы начать"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email адрес"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Пароль"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <UserCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  {...register("role")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all appearance-none"
                >
                  <option value="student">Я студент</option>
                  <option value="teacher">Я преподаватель</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {isLogin ? "Войти" : "Создать аккаунт"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isLogin
                    ? "Нет аккаунта? Зарегистрируйтесь"
                    : "Уже есть аккаунт? Войдите"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
