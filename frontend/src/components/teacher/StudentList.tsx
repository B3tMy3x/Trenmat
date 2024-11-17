import { motion } from "framer-motion";
import { User, BookOpen, Brain } from "lucide-react";
import { Student, Quiz } from "../../types";

interface StudentListProps {
  students: Student[];
  assignments: Quiz[];
}

export function StudentList({ students, assignments }: StudentListProps) {
  const getStudentCompletionRate = (student: Student) => {
    if (assignments.length === 0) return 0;
    const completedCount = assignments.filter((a) =>
      a.completedBy.includes(student.id),
    ).length;
    return (completedCount / assignments.length) * 100;
  };

  return (
    <div className="space-y-6">
      {students.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {student.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getStudentCompletionRate(student).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall Completion
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Assignments
                </div>
                <div className="font-semibold dark:text-white">
                  {
                    assignments.filter((a) =>
                      a.completedBy.includes(student.id),
                    ).length
                  }{" "}
                  of {assignments.length} completed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Brain className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Practice Sessions
                </div>
                <div className="font-semibold dark:text-white">
                  {student.practiceStats.totalAttempts} attempts (
                  {(
                    (student.practiceStats.correctAnswers /
                      student.practiceStats.totalAttempts) *
                    100
                  ).toFixed(1)}
                  % accuracy)
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {students.length === 0 && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No students enrolled yet
        </div>
      )}
    </div>
  );
}
