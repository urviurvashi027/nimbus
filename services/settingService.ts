import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  FeedbackPayload,
  FeedbackResponse,
  ReportBugPayload,
  ReportBugResponse,
} from "@/types/settingTypes";

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

export const reportBug = async (
  data: ReportBugPayload
): Promise<ReportBugResponse> => {
  try {
    const response: AxiosResponse<ReportBugResponse> = await axios.post(
      API_ENDPOINTS.reportBug,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logFeedback = async (
  data: FeedbackPayload
): Promise<FeedbackResponse> => {
  try {
    const response: AxiosResponse<FeedbackResponse> = await axios.put(
      API_ENDPOINTS.logFeedback,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
