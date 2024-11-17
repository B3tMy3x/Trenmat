import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Code2, Database, Container, Zap } from "lucide-react";

interface InfoModalProps {
  onClose: () => void;
}

export function InfoModal({ onClose }: InfoModalProps) {
  const { t } = useTranslation();

  const technologies = [
    {
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      section: "frontend",
    },
    {
      icon: <Database className="w-6 h-6 text-purple-500" />,
      section: "backend",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-4xl relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {t("about.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {technologies.map(({ icon, section }) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold dark:text-white">
                  {t(`about.stack.${section}.title`)}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t(`about.stack.${section}.description`)}
              </p>
              <ul className="space-y-2">
                {(
                  t(`about.stack.${section}.features`, {
                    returnObjects: true,
                  }) as string[]
                ).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap size={16} className="text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Container className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold dark:text-white">
              {t("about.stack.features.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(
              t("about.stack.features.list", {
                returnObjects: true,
              }) as string[]
            ).map((feature: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <Zap size={16} className="text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
