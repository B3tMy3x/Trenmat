import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, BookOpen, Calendar } from "lucide-react";
import { Class } from "../types";
import { ClassView } from "./teacher/ClassView";
import { ClassCard } from "./teacher/ClassCard";
import { NewClassModal } from "./teacher/NewClassModal";

export function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const createClass = (className: string) => {
    if (!className.trim()) return;

    const newClass: Class = {
      id: Date.now().toString(),
      name: className,
      teacherId: "1",
      students: [],
      assignments: [],
    };
    setClasses([...classes, newClass]);
    setShowNewClassForm(false);
  };

  if (selectedClass) {
    return (
      <ClassView class={selectedClass} onBack={() => setSelectedClass(null)} />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your classes and track student progress
          </p>
        </div>
        <button
          onClick={() => setShowNewClassForm(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">
              Total Students
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {classes.reduce((acc, cls) => acc + cls.students.length, 0)}
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
            <h3 className="text-lg font-semibold dark:text-white">
              Active Classes
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {classes.length}
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
              <Calendar className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">
              Total Assignments
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {classes.reduce((acc, cls) => acc + cls.assignments.length, 0)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            class={cls}
            onClick={() => setSelectedClass(cls)}
          />
        ))}
      </div>

      <AnimatePresence>
        {showNewClassForm && (
          <NewClassModal
            onClose={() => setShowNewClassForm(false)}
            onCreate={createClass}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
