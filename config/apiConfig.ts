// apiConfig.ts

import { contactUs } from "@/services/contactService";
import { logFeedback } from "@/services/settingService";

// Define base URLs for different environments
const ENV = process.env.NODE_ENV as "development" | "staging" | "production";

// Define the base URL for different environments
const BASE_URLS = {
  development: "https://nimbus.silentbonus.com",
  staging: "https://nimbus.silentbonus.com",
  production: "https://nimbus.silentbonus.com",
};

// Get the base URL based on the environment
const BASE_URL = BASE_URLS[ENV];

export const API_URL = BASE_URL;

// Define API endpoints
export const API_ENDPOINTS = {
  login: `${BASE_URL}/auth/login/`,
  register: `${BASE_URL}/auth/register/`,
  logout: `${BASE_URL}/auth/logout/`,

  fetchUserDetails: `${BASE_URL}/profile/users/me/`,

  getOtp: `${BASE_URL}/auth/request-otp/`,
  verifyOtp: `${BASE_URL}/auth/verify-otp/`,

  setPassword: `${BASE_URL}/auth/set-password/`,
  forgotPassword: `${BASE_URL}/auth/forgot-password/`,
  changePassword: `${BASE_URL}/auth/reset-password/`,

  createHabit: `${BASE_URL}/api/habits/`,
  bulkCreateHabit: `${BASE_URL}/api/habits/bulk_create/`,
  activateHabitTemplate: (id: number | string) => `${BASE_URL}/api/habit-templates/${id}/activate/`,
  habitTypeList: `${BASE_URL}/api/habit-types/`,
  habitTagList: `${BASE_URL}/api/tags/`,
  habitDetailsById: `${BASE_URL}/api/habits/`,
  habitDelete: `${BASE_URL}/api/habits/delete`,
  habitUnit: `${BASE_URL}/api/habit-units/`,

  habitPatch: `${BASE_URL}/api/habits/`,

  getArticleList: `${BASE_URL}/media/media-assets/?type=article`,
  getArticleDetails: `${BASE_URL}/media/media-assets/`,
  getSoundscapeList: `${BASE_URL}/media/media-assets/?type=soundscape`,
  getJournalList: `${BASE_URL}/assesment/journal-templates/`,
  submitJournal: `${BASE_URL}/assesment/journal-entries/`,
  getJournalEntry: `${BASE_URL}/assesment/journal-entries/`,
  getWorkoutVideoList: `${BASE_URL}/media/media-assets/?type=video`,
  getRecipeList: `${BASE_URL}/media/media-assets/?type=recipe`,
  getRoutineTemplate: `${BASE_URL}/api/habit-templates/`,
  //TODO: category Data fix
  getShortVideoList: `${BASE_URL}/media/media-assets/?type=shortVideo`,
  getAudioBookList: `${BASE_URL}/media/media-assets/?type=meditation&category=audioBook`,
  getMeditationList: `${BASE_URL}/media/media-assets/?type=meditation&category=breathwork`,

  getMentalTestList: `${BASE_URL}/assesment/assessments/`,
  getWorkouts: `${BASE_URL}/workouts/`,
  getWorkoutDetails: (id: number | string) => `${BASE_URL}/workouts/${id}/`,
  calorieCalculator: `${BASE_URL}/calculators/calories/`,
  proteinIntakeCalculator: `${BASE_URL}/calculators/protein/`,
  bodyShapeCalculator: `${BASE_URL}/calculators/body_shape/`,

  reportBug: `${BASE_URL}/api/bug-reports/`,
  logFeedback: `${BASE_URL}/api/feedback/`,

  personaQuestion: `${BASE_URL}/profile/persona-questions/`,
  submitPersonaAnswers: `${BASE_URL}/profile/persona-answers/`,
  contactUs: `${BASE_URL}/support/tickets/`,

  markHabitDone: (habitId: number) =>
    `${BASE_URL}/api/habits/${habitId}/mark_complete/`,

  // ✅ NEW: Function for fetching habits with date & filter
  getDailyCheckInByDate: (date: string, isDailyCheckIn = true) =>
    `${BASE_URL}/api/habits/?date=${date}&is_daily_checkin=${isDailyCheckIn}`,
  // ✅ NEW: Function for fetching habits with date & filter
  // ✅ Dynamic: fetch single habit details by id + date
  getHabitDetailsByDate: (habitId: number, date: string) =>
    `${BASE_URL}/api/habits/${habitId}/?date=${date}`,
};
