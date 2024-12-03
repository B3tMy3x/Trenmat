import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Clock, HelpCircle } from "lucide-react";
import apiClient from "../../apiClient";

interface NewAssignmentModalProps {
  onClose: () => void;
  class_id: number;
}

export function NewAssignmentModal({ onClose, class_id }: NewAssignmentModalProps) {
  const [formData, setFormData] = useState({
    class_id: class_id,
    test_name: "",
    hand_in_by_date: "",
    created_date: new Date().toISOString(),
    multiple_attempts: false,
    number_of_questions: 5,
    time_to_answer: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.post("/assignment", formData, {
        headers: { token },
      });

      if (response.data) {
        console.log("Assignment created successfully:", response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  return (
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Create New Assignment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignment Title
            </label>
            <input
              type="text"
              value={formData.test_name}
              onChange={(e) =>
                setFormData({ ...formData, test_name: e.target.value })
              }
              placeholder="Enter assignment title"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.hand_in_by_date}
              onChange={(e) =>
                setFormData({ ...formData, hand_in_by_date: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions
              </label>
               <div className="relative">
                <HelpCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  min="1"
                  value={formData.number_of_questions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number_of_questions: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time per Question (s)
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  min="5"
                  value={formData.time_to_answer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_to_answer: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="multiple_attempts"
              checked={formData.multiple_attempts}
              onChange={(e) =>
                setFormData({ ...formData, multiple_attempts: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <label
              htmlFor="multiple_attempts"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Allow multiple attempts
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}