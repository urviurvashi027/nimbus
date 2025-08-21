import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
  GetOtpRequest,
  GetOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/loginTypes";
import Toast from "react-native-toast-message";

// Login API request
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      API_ENDPOINTS.login,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    // error.response.data - have backend response where as error.message has axios error
    // Extract error message properly
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    // Show error toast
    Toast.show({
      type: "error",
      text1: "Login Failed",
      text2: errorMessage,
      position: "bottom",
    });

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

export const getOtp = async (data: GetOtpRequest): Promise<GetOtpResponse> => {
  try {
    const response: AxiosResponse<GetOtpResponse> = await axios.post(
      API_ENDPOINTS.getOtp,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  try {
    const response: AxiosResponse<VerifyOtpResponse> = await axios.post(
      API_ENDPOINTS.verifyOtp,
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

export async function postOnboardingData(data: any) {
  return data;
}
