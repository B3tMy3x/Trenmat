import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Quiz, Student } from "../../types";

interface AssignmentStatsProps {
  assignments: Quiz[];
  students: Student[];
}

export function AssignmentStats({
  assignments,
  students,
}: AssignmentStatsProps) {
  const getCompletionRate = (assignment: Quiz) => {
    if (students.length === 0) return 0;
    return (assignment.completedBy.length / students.length) * 100;
  };

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
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due: {assignment.dueDate.toLocaleDateString()}
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
                {assignment.completedBy.length} of {students.length} completed
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate(assignment)}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {assignments.length === 0 && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No assignments created yet
        </div>
      )}
    </div>
  );
}
