import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Users, BookOpen, Award, Brain } from "lucide-react";
import { Class, Quiz } from "../../types";
import { AssignmentStats } from "./AssignmentStats";
import { StudentList } from "./StudentList";
import { NewAssignmentModal } from "./NewAssignmentModal";

interface ClassViewProps {
  class: Class;
  onBack: () => void;
}

export function ClassView({ class: cls, onBack }: ClassViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "assignments" | "students"
  >("overview");
  const [showNewAssignment, setShowNewAssignment] = useState(false);

  const getCompletionRate = (assignment: Quiz) => {
    return cls.students.length > 0
      ? (assignment.completedBy.length / cls.students.length) * 100
      : 0;
  };

  const getAverageCompletion = () => {
    if (cls.assignments.length === 0) return 0;
    const totalCompletion = cls.assignments.reduce(
      (acc, assignment) => acc + getCompletionRate(assignment),
      0,
    );
    return totalCompletion / cls.assignments.length;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
          {cls.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold dark:text-white">Students</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {cls.students.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BookOpen className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold dark:text-white">Assignments</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {cls.assignments.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Award className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold dark:text-white">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {getAverageCompletion().toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Brain className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold dark:text-white">Practice Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {cls.students.reduce(
              (acc, student) => acc + student.practiceStats.totalAttempts,
              0,
            )}
          </p>
        </motion.div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {(["overview", "assignments", "students"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <AssignmentStats
              assignments={cls.assignments}
              students={cls.students}
            />
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewAssignment(true)}
                className="btn-primary"
              >
                <Plus size={20} />
                New Assignment
              </button>
            </div>
            <AssignmentStats
              assignments={cls.assignments}
              students={cls.students}
            />
          </div>
        )}

        {activeTab === "students" && (
          <StudentList students={cls.students} assignments={cls.assignments} />
        )}
      </div>

      {showNewAssignment && (
        <NewAssignmentModal onClose={() => setShowNewAssignment(false)} />
      )}
    </div>
  );
}
