import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

interface ChangePasswordResponse {
  data: any;
  success: string;
  message: string;
}

interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response: AxiosResponse<ChangePasswordResponse> = await axios.put(
      API_ENDPOINTS.changePassword,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
