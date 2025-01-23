// apiConfig.ts

// Define base URLs for different environments
const ENV = process.env.NODE_ENV as "development" | "staging" | "production";

// Define the base URL for different environments
const BASE_URLS = {
  development: "https://dev-api.yourdomain.com/api",
  staging: "https://staging-api.yourdomain.com/api",
  production: "https://api.yourdomain.com/api",
};

// Get the base URL based on the environment
const BASE_URL = BASE_URLS[ENV];

export const API_URL = BASE_URL;

// Define API endpoints
export const API_ENDPOINTS = {
  login: `${BASE_URL}/auth/login/`,
  register: `${BASE_URL}/auth/register/`,
  logout: `${BASE_URL}/habits/logout/`,

  createHabit: `${BASE_URL}/habits/create`,
  habitList: `${BASE_URL}/habits/list`,
  habitPatch: `${BASE_URL}/habits/list`,
  deleteHabit: `${BASE_URL}/habits/list`,
  getHabitDetailsById: `${BASE_URL}/habits/id`,

  toolList: `${BASE_URL}/habits/list`,
  getSoundscapeList: `${BASE_URL}/habits/list`,
  downloadMedia: `${BASE_URL}/habits/list`,
  getWorkoutVideo: `${BASE_URL}/habits/list`,
  // Add more API endpoints as needed
};
