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
  test_name: string;
  hand_in_by_date: string;
  created_date: string;
  multiple_attempts: boolean;
  number_of_questions: number;
  time_to_answer: number;
  completedBy: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Class {
  id: number;
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
