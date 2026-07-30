import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { Subnet, SubnetCalculationResult, SubnetExerciseQuestion, SubnetExerciseResult, SubnetExerciseSubmission } from "./types";

export async function calculateSubnet(ip: string, prefixLength: number): Promise<SubnetCalculationResult> {
  const response = await loggedFetch(`${API_BASE_URL}/api/subnet/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip, prefixLength }),
  });
  if (!response.ok) throw new Error(`Błąd obliczania podsieci: ${response.status}`);
  return response.json();
}

export interface SplitOptions {
  ip: string;
  prefixLength: number;
  subnetCount?: number;
  hostsPerSubnet?: number;
}

export async function splitSubnet(options: SplitOptions): Promise<Subnet[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/subnet/split`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!response.ok) throw new Error(`Błąd dzielenia sieci: ${response.status}`);
  return response.json();
}

export async function fetchRandomSubnetExercise(difficulty: number): Promise<SubnetExerciseQuestion> {
  const response = await loggedFetch(`${API_BASE_URL}/api/exercises/subnet/random?difficulty=${difficulty}`);
  if (!response.ok) throw new Error(`Błąd pobierania zadania: ${response.status}`);
  return response.json();
}

export async function submitSubnetExercise(submission: SubnetExerciseSubmission): Promise<SubnetExerciseResult> {
  const response = await loggedFetch(`${API_BASE_URL}/api/exercises/subnet/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
  if (!response.ok) throw new Error(`Błąd walidacji zadania: ${response.status}`);
  return response.json();
}
