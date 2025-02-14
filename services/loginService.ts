import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
} from "@/types/loginTypes";

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
