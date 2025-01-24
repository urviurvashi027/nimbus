import axios, { AxiosResponse, AxiosError } from "axios";
// import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
} from "@/types/loginTypes";

const BASE_URL = `https://cd71-2401-4900-1cb9-115b-51a9-38ec-68d6-8e9a.ngrok-free.app`;

export const API_ENDPOINTS = {
  login: `${BASE_URL}/auth/login/`,
  register: `${BASE_URL}/auth/register/`,
  logout: `${BASE_URL}/auth/logout/`,

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

// Login API request
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      API_ENDPOINTS.login,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Signup API request
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response: AxiosResponse<SignupResponse> = await axios.post(
      API_ENDPOINTS.register,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// List API request
export const logout = async (data: LogoutRequest): Promise<LogoutResponse> => {
  try {
    const response: AxiosResponse<LogoutResponse> = await axios.post(
      API_ENDPOINTS.logout,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
