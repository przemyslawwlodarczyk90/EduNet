import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type {
  DetectiveCase,
  LearningPathModule,
  OrderQuiz,
  QuizResult,
  QuizSummary,
  QuizView,
} from "./types";

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/quizzes`);
  if (!response.ok) throw new Error(`Błąd pobierania listy quizów: ${response.status}`);
  return response.json();
}

export async function fetchQuiz(id: string): Promise<QuizView> {
  const response = await loggedFetch(`${API_BASE_URL}/api/quizzes/${id}`);
  if (!response.ok) throw new Error(`Błąd pobierania quizu: ${response.status}`);
  return response.json();
}

export async function submitQuiz(id: string, answers: number[]): Promise<QuizResult> {
  const response = await loggedFetch(`${API_BASE_URL}/api/quizzes/${id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!response.ok) throw new Error(`Błąd wysyłania odpowiedzi: ${response.status}`);
  return response.json();
}

export async function fetchDetectiveCases(): Promise<DetectiveCase[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/detective-cases`);
  if (!response.ok) throw new Error(`Błąd pobierania przypadków detektywistycznych: ${response.status}`);
  return response.json();
}

export async function fetchOrderQuizzes(): Promise<OrderQuiz[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/order-quizzes`);
  if (!response.ok) throw new Error(`Błąd pobierania quizów porządkowych: ${response.status}`);
  return response.json();
}

export async function fetchLearningPath(): Promise<LearningPathModule[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/learning-path`);
  if (!response.ok) throw new Error(`Błąd pobierania ścieżki nauki: ${response.status}`);
  return response.json();
}
