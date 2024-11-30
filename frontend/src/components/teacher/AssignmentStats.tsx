import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Quiz, Student } from "../../types";
import apiClient from "../../apiClient";

interface AssignmentStatsProps {
  class_id: number;
  students: Student[];
}

export function AssignmentStats({ class_id, students }: AssignmentStatsProps) {
  const [assignments, setAssignments] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get(`/assignments/${class_id}`, {
          headers: { token },
        });
        setAssignments(response.data.assignments);
      } catch (err) {
        setError("Ошибка при загрузке заданий");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [class_id]);

  const getCompletionRate = (assignment: Quiz) => {
    if (students.length === 0) return 0;
    return (assignment.completedBy / students.length) * 100;
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      {assignments.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">
                  {assignment.test_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due: {new Date(assignment.hand_in_by_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getCompletionRate(assignment).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {assignment.completedBy} of {students.length} completed
              </span>
            </ div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}