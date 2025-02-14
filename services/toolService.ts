import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { LoginRequest, LoginResponse } from "@/types/loginTypes";
import {
  GetWorkoutVideoRequest,
  GetWorkoutVideoResponse,
  GetSoundscapeListRequest,
  GetSoundscapeListResponse,
  DownloadMediaListRequest,
  DownloadMediaListResponse,
} from "@/types/toolTypes";

// Type definitions for login, signup, and list responses

// get Workout Video request
export const getWorkoutVideo = async (
  data: GetWorkoutVideoRequest
): Promise<GetWorkoutVideoResponse> => {
  try {
    const response: AxiosResponse<GetWorkoutVideoResponse> = await axios.post(
      API_ENDPOINTS.getWorkoutVideo,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get soundsacpe List
export const getSoundscaleList = async (
  data: GetSoundscapeListRequest
): Promise<GetSoundscapeListResponse> => {
  try {
    const response: AxiosResponse<GetSoundscapeListResponse> = await axios.post(
      API_ENDPOINTS.getSoundscapeList,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// download media
export const downloadMedia = async (
  data: DownloadMediaListRequest
): Promise<DownloadMediaListResponse> => {
  try {
    const response: AxiosResponse<DownloadMediaListResponse> = await axios.post(
      API_ENDPOINTS.downloadMedia,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
