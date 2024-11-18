import { motion } from "framer-motion";
import { Book, Users, BarChart2 } from "lucide-react";
import { Class } from "../../types";

interface ClassCardProps {
  class: Class;
  onClick: () => void;
}

export function ClassCard({ class: cls, onClick }: ClassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Book className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold dark:text-white">{cls.cl_name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Users size={18} />
          <span>{cls.students.length} students</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <BarChart2 size={18} />
          <span>{cls.assignments.length} assignments</span>
        </div>
      </div>

      <button className="btn-primary w-full mt-4">View Class</button>
    </motion.div>
  );
}
