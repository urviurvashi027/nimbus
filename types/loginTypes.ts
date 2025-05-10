interface UserData {
  username: string;
  email: string;
  id: number;
  refresh: string;
  access: string;
}

// TODO add types
interface LogoutData {
  data: any;
}

interface SignupData {
  data: any;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserData | {};
  error_code?: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: LogoutData;
}

export interface SignupRequest {
  username: string;
  full_name: string;
  email?: string;
  password?: string;
}

export interface GetOtpRequest {
  phone_number: string;
}

export interface GetOtpResponse {
  success: boolean;
  message: string;
  data: any;
  error?: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: any;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: SignupData;
}
