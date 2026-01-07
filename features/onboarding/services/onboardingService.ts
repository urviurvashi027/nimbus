import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

export type PersonaQuestionType = "single" | "multiple" | "time" | "signature";

export interface PersonaChoice {
  id: string;
  label: string;
  icon?: string | null; // ":sleepy:"
}

export interface PersonaQuestion {
  id: number;
  title: string;
  subtitle?: string | null;
  type: PersonaQuestionType;
  choices: PersonaChoice[];
}

export interface PersonaQuestionsResponse {
  success: boolean;
  message: string;
  data: PersonaQuestion[];
  error_code?: string;
}

// --------------------
// ✅ UI types (what you keep in React state)
// --------------------
export type PersonaAnswerUI =
  | string
  | string[]
  | Date
  | boolean // signature completion
  | null;

export type PersonaAnswersUIMap = Record<number, PersonaAnswerUI>;

// --------------------
// ✅ API types (what you send to backend)
// Keys are stringified question IDs
// --------------------
export type IsoDateString = string;

export type PersonaAnswerApi = string | string[] | IsoDateString;
export type PersonaAnswersPayload = Record<string, PersonaAnswerApi>;

export interface SubmitPersonaAnswersResponse {
  success: boolean;
  message: string;
  data: any;
  error_code?: string;
}

// Convert UI answers → backend payload, and skip local-only ids
export function serializePersonaAnswers(
  ui: PersonaAnswersUIMap,
  opts?: { skipIds?: number[] }
): PersonaAnswersPayload {
  const skip = new Set(opts?.skipIds ?? []);
  const out: PersonaAnswersPayload = {};

  Object.entries(ui).forEach(([qidStr, v]) => {
    const qid = Number(qidStr);
    if (skip.has(qid)) return;

    // don't ever send signature boolean
    if (typeof v === "boolean") return;
    if (v == null) return;

    if (v instanceof Date) {
      out[String(qid)] = v.toISOString();
      return;
    }

    out[String(qid)] = v; // string or string[]
  });

  return out;
}

export async function fetchPersonaQuestions(): Promise<PersonaQuestionsResponse> {
  const res: AxiosResponse<PersonaQuestionsResponse> = await axios.get(
    API_ENDPOINTS.personaQuestion
  );
  return res.data;
}

/**
 * Backend contract you shared:
 * "Send a single JSON object where Keys are Question IDs and Values are the answers."
 * So POST body should be the payload object itself (NOT wrapped in { answers: ... })
 */
export async function submitPersonaAnswers(
  payload: PersonaAnswersPayload
): Promise<SubmitPersonaAnswersResponse> {
  const res: AxiosResponse<SubmitPersonaAnswersResponse> = await axios.post(
    API_ENDPOINTS.submitPersonaAnswers,
    payload
  );
  return res.data;
}
