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
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SetPasswordResponse,
  SetPasswordRequest,
} from "@/types/loginTypes";

type UserProfile = {
  full_name?: string | null;
  // phone_number?: string | null;
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile: {
    phone_number: string | null;
    height: number | string | null;
    weight: number | string | null;
    age: number | null;
    gender: string | null;
  };
  settings: {
    weight_unit?: "kg" | "lbs";
    height_unit?: "cm" | "in";
    liquid_unit?: "ml" | "oz";
    weather_unit?: "celsius" | "fahrenheit";
    start_of_day?: string | null; // "06:00"
    start_of_week?: "monday" | "sunday";
    sleep_time?: string | null;
    location?: string | null;
    // weight_unit: string | null;
    // height_unit: string | null;
    // liquid_unit: string | null;
    // weather_unit: string | null;
    // start_of_day: string | null;
    // start_of_week: string | null;
    // sleep_time: string | null;
    // location: string | null;
  };
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
  };
  notifications: [
    {
      notification_type: string;
      enabled: true;
      time: string;
      days_of_week: string[];
    }
  ];
  // add whatever fields your API returns
};

type FetchUserResponse = {
  success: boolean;
  data: UserProfile;
  message: string;
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
    // error.response.data - have backend response where as error.message has axios error
    // Extract error message properly
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
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
    // Normalize error to match SignupResponse
    if (error.response?.data) {
      return error.response.data as SignupResponse;
    }
    return {
      success: false,
      message: error.message ?? "Something went wrong",
      data: {},
    };
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

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response: AxiosResponse<ForgotPasswordResponse> = await axios.post(
      API_ENDPOINTS.forgotPassword,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response: AxiosResponse<ResetPasswordResponse> = await axios.post(
      API_ENDPOINTS.changePassword,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const setPassword = async (
  data: SetPasswordRequest
): Promise<SetPasswordResponse> => {
  try {
    const response: AxiosResponse<SetPasswordResponse> = await axios.post(
      API_ENDPOINTS.setPassword,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const getUserDetails = async (): Promise<FetchUserResponse> => {
  try {
    const response: AxiosResponse<FetchUserResponse> = await axios.get(
      API_ENDPOINTS.fetchUserDetails
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const saveUpdateUser = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.patch(
      API_ENDPOINTS.fetchUserDetails,
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
