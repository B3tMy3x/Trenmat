export type UserRole = "student" | "teacher";
export type Theme = "light" | "dark";

export interface SessionHistory {
  date: string;
  correct: number;
  count: number;
  accuracy: number;
}

export interface User {
  email: string;
  role: string;
  practice_accuracy: number;
  total_sessions: number;
  correct_answers: number;
  recent_activity: string;
  session_history: SessionHistory[];
  learning_streak: number;
}


export interface Homework {
  id: string;
  test_name: string;
  hand_in_by_date: string;
  completed_by: number;
  multiple_attempts: boolean;
  number_of_questions: number;
  time_to_answer: number;
}

export interface HomeworkResponse {
  homeworks: Homework[];
}

export interface StartHomeworkResponse {
  status: string;
  message: string;
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
