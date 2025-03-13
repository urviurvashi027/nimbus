import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  HabitCreateRequest,
  HabitCreateResponse,
  HabitListResponse,
  HabitDeleteRequest,
  HabitDeleteResponse,
  HabitDoneRequest,
  HabitDoneResponse,
  HabitDetailRequest,
  HabitDetailResponse,
  HabitTypeResponse,
  HabitTagResponse,
  HabitUnitesponse,
} from "@/types/habitTypes";
import Toast from "react-native-toast-message";

// Type definitions for login, signup, and list responses

// create habit API request
export const createHabit = async (
  data: HabitCreateRequest
): Promise<HabitCreateResponse> => {
  try {
    const response: AxiosResponse<HabitCreateResponse> = await axios.post(
      API_ENDPOINTS.createHabit,
      data
    );
    return response.data; // Return the data containing the token
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    // Show error toast
    Toast.show({
      type: "error",
      text1: "Habit Creation Failed",
      text2: errorMessage,
      position: "bottom",
    });
    throw error.response ? error.response.data : error.message;
  }
};

// get habit list
export const getHabitList = async (): Promise<HabitListResponse> => {
  try {
    const response: AxiosResponse<HabitListResponse> = await axios.get(
      API_ENDPOINTS.createHabit
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get habit type
export const getHabitType = async (): Promise<HabitTypeResponse> => {
  try {
    const response: AxiosResponse<HabitTypeResponse> = await axios.get(
      API_ENDPOINTS.habitTypeList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get habit tag
export const getHabitTag = async (): Promise<HabitTagResponse> => {
  try {
    const response: AxiosResponse<HabitTagResponse> = await axios.get(
      API_ENDPOINTS.habitTagList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get habit tag
export const getHabitUnitData = async (): Promise<HabitUnitesponse> => {
  try {
    const response: AxiosResponse<HabitUnitesponse> = await axios.get(
      API_ENDPOINTS.habitUnit
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get habit details by id
export const getHabitDetailsById = async (
  id: string
): Promise<HabitDetailResponse> => {
  try {
    const response: AxiosResponse<HabitDetailResponse> = await axios.get(
      `${API_ENDPOINTS.habitDetailsById}${id}/`
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// delete habit request
export const deleteHabit = async (id: number): Promise<HabitDeleteResponse> => {
  console.log("i am called delete habit");
  try {
    const response: AxiosResponse<HabitDeleteResponse> = await axios.delete(
      `${API_ENDPOINTS.habitDetailsById}${id}/`
    );
    console.log(response.status, "response.data;");
    return response.data; // Return the data containing the token
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// mark habit as done
export const markHabitDone = async (
  data: HabitDoneRequest
): Promise<HabitDoneResponse> => {
  try {
    const response: AxiosResponse<HabitDoneResponse> = await axios.post(
      API_ENDPOINTS.habitPatch,
      data
    );
    console.log(response.status, "response.status", typeof response.status);
    if (response.status === 204) {
      Toast.show({
        type: "success",
        text1: "Meditation Deleted",
        text2: "The meditation track was successfully removed.",
      });
    }
    return response.data; // Return the list data
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Delete Failed",
      text2: "Something went wrong. Please try again.",
    });
    throw error.response ? error.response.data : error.message;
  }
};
