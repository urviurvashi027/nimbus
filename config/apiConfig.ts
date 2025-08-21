// apiConfig.ts

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
  getOtp: `${BASE_URL}/auth/request-phone-otp/`,
  verifyOtp: `${BASE_URL}/auth/verify-phone-otp/`,

  createHabit: `${BASE_URL}/api/habits/`,

  // get habit type `equest
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
  getRoutineTemplate: `${BASE_URL}/media/media-assets/?type=routineTemplate`,
  //TODO: category Data fix
  getShortVideoList: `${BASE_URL}/media/media-assets/?type=shortVideo`,
  getAudioBookList: `${BASE_URL}/media/media-assets/?type=meditation&category=audioBook`,
  getMeditationList: `${BASE_URL}/media/media-assets/?type=meditation&category=breathwork`,

  getMentalTestList: `${BASE_URL}/assesment/assessments/`,

  // getSoundscapeDetials: `${BASE_URL}/habits/list`,
  // toolList: `${BASE_URL}/habits/list`,
  // downloadMedia: `${BASE_URL}/habits/list`,
  // getWorkoutVideo: `${BASE_URL}/habits/list`,

  // Add more API endpoints as needed
};
