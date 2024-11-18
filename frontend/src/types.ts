export type UserRole = "student" | "teacher";
export type Theme = "light" | "dark";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  dueDate: Date;
  completedBy: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  cl_name: string;
  students: Student[];
  assignments: Quiz[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  practiceStats: {
    totalAttempts: number;
    correctAnswers: number;
  };
}

export interface AssignmentStats {
  totalStudents: number;
  completedCount: number;
  completionRate: number;
}
