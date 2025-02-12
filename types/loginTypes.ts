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
  data: UserData;
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

export interface SignupResponse {
  success: boolean;
  message: string;
  data: SignupData;
}
