// UI Types for Self-Care Module

export interface WorkoutVideoListItem {
  id: number;
  title: string;
  image: {
    uri: string;
  };
  coachName: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface MeditationAudioListItem {
  id: number;
  title: string;
  image: {
    uri: string;
  };
  coachName: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

// Backend Tpypes for Self-Care Module
export interface JournalListItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  icon: string;
  prompts: {
    id: number;
    text: string;
  };
}

export interface JournalListResponse {
  data: JournalListItem[];
  message: string;
}

export interface JournalSubmitRequest {
  template_id: number;
  answers: { id: number; answer: string }[];
}

export interface JournalSubmitResponse {
  status: string;
  message: string;
}

export type JournalAnswer = {
  prompt_text: string;
  answer: string;
};

export interface JournalEntryListResponse {
  id: number;
  template_title: string;
  created_at: string; // ISO date string
  answers: JournalAnswer[];
}

export type MentalTestItem = {
  id: string;
  title: string;
  image: string;
};

export interface MentalTestListResponse {
  data: MentalTestItem[];
}

export interface WorkoutListItem {
  id: number;
  title: string;
  image: string;
  coach_name: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface WorkoutVideoListResponse {
  data: WorkoutListItem[];
}

export interface MeditationListItem {
  id: number;
  title: string;
  image: string;
  coach_name: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface MeditationVideoListResponse {
  data: MeditationListItem[];
}
