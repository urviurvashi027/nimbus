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
  recipient: string;
}

export interface GetOtpResponse {
  success: boolean;
  message: string;
  data: any;
  error?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: any;
  error?: string;
}

export interface ResetPasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message:
    | {
        phone_number?: string;
        email?: string;
        full_name?: string;
        password?: string;
        username?: string;
      }
    | string;
  data: any;
  error_code?: string;
}

export interface SetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  // password2: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
  data: any;
  error_code?: string;
}

export interface VerifyOtpRequest {
  recipient: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: any;
  error_code?: string;
}

export interface SignupResponse {
  success: boolean;
  message:
    | {
        phone_number?: string;
        email?: string;
        full_name?: string;
        password?: string;
        username?: string;
      }
    | string;
  data: any;
  error_code?: string;
}
