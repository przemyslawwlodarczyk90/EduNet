import type { OsiLayer } from "../simulation/types";

export interface QuizSummary {
  id: string;
  title: string;
  moduleId: string;
  osiLayers: OsiLayer[];
  questionCount: number;
}

export interface QuizQuestionView {
  id: string;
  prompt: string;
  options: string[];
}

export interface QuizView {
  id: string;
  title: string;
  moduleId: string;
  osiLayers: OsiLayer[];
  questions: QuizQuestionView[];
}

export interface QuizResult {
  quizId: string;
  correct: number;
  total: number;
  correctness: boolean[];
  explanations: string[];
}

export interface DetectiveFact {
  label: string;
  value: string;
}

export interface DetectiveCase {
  id: string;
  moduleId: string;
  title: string;
  symptom: string;
  facts: DetectiveFact[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OrderQuizItem {
  id: string;
  label: string;
}

export interface OrderQuiz {
  id: string;
  title: string;
  moduleId: string;
  correctOrder: OrderQuizItem[];
}

export interface LearningPathModule {
  id: string;
  label: string;
  navView: string;
  order: number;
}
