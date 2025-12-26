export enum Difficulty {
  BASIC = 'Básico',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: number[]; // Index of selected answer for each question, -1 if skipped
  score: number;
  isFinished: boolean;
  questions: Question[];
}

export type AppView = 'home' | 'quiz' | 'results' | 'loading';
