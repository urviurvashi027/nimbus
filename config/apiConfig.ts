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

  createHabit: `${BASE_URL}/api/habits/`,

  // get habit type `equest
  habitTypeList: `${BASE_URL}/api/habit-types/`,
  habitTagList: `${BASE_URL}/api/tags/`,
  habitDetailsById: `${BASE_URL}/api/habits/`,
  habitDelete: `${BASE_URL}/api/habits/delete`,

  habitPatch: `${BASE_URL}/habits/list`,
  toolList: `${BASE_URL}/habits/list`,
  getSoundscapeList: `${BASE_URL}/habits/list`,
  downloadMedia: `${BASE_URL}/habits/list`,
  getWorkoutVideo: `${BASE_URL}/habits/list`,
  // Add more API endpoints as needed
};
