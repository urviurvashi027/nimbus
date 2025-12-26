import axios from "axios";

export type OnboardingQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  type: "single" | "multiple" | "time" | "signature";
  choices?: { id: string; label: string }[];
};

export type GetOnboardingQuestionsResponse = {
  success: boolean;
  message?: string;
  data: { questions: OnboardingQuestion[] };
  error_code?: string;
};

export type SubmitOnboardingResponse = {
  success: boolean;
  message?: string;
  data?: any;
  error_code?: string;
};

export async function fetchOnboardingQuestions(): Promise<GetOnboardingQuestionsResponse> {
  const res = await axios.get("/onboarding/questions"); // <-- your endpoint
  return res.data;
}

export async function submitOnboardingAnswers(payload: {
  answers: Record<string, any>;
}): Promise<SubmitOnboardingResponse> {
  const res = await axios.post("/onboarding/submit", payload); // <-- your endpoint
  return res.data;
}
