// import axios, { AxiosResponse, AxiosError } from "axios";
// import { API_ENDPOINTS } from "@/config/apiConfig";
// import { LoginRequest, LoginResponse } from "@/types/loginTypes";
// import { HabitItem, HabitListResponse } from "@/types/habitTypes";
// import { SignupRequest, SignupResponse } from "@/types/signUpTypes";

// // Type definitions for login, signup, and list responses

// // Login API request
// export const login = async (data: LoginRequest): Promise<LoginResponse> => {
//   try {
//     const response: AxiosResponse<LoginResponse> = await axios.post(
//       API_ENDPOINTS.login,
//       data
//     );
//     return response.data; // Return the data containing the token
//   } catch (error: any) {
//     throw error.response ? error.response.data : error.message;
//   }
// };

// // Signup API request
// export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
//   try {
//     const response: AxiosResponse<SignupResponse> = await axios.post(
//       API_ENDPOINTS.signup,
//       data
//     );
//     return response.data; // Return the data containing the token
//   } catch (error: any) {
//     throw error.response ? error.response.data : error.message;
//   }
// };

// // List API request
// export const getList = async (token: string): Promise<HabitListResponse> => {
//   try {
//     const response: AxiosResponse<HabitListResponse> = await axios.get(
//       API_ENDPOINTS.list,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return response.data; // Return the list data
//   } catch (error: any) {
//     throw error.response ? error.response.data : error.message;
//   }
// };
