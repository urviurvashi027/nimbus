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
  HabitRequest,
  HabitResponse,
} from "@/types/habitTypes";

// Type definitions for login, signup, and list responses

// create habit API request
export const createHabit = async (
  data: HabitCreateRequest
): Promise<HabitCreateResponse> => {
  console.log("serice called for creation", API_ENDPOINTS.createHabit);
  try {
    const response: AxiosResponse<HabitCreateResponse> = await axios.post(
      API_ENDPOINTS.createHabit,
      data
    );
    console.log(response, "response from creation");
    return response.data; // Return the data containing the token
  } catch (error: any) {
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

// delete habit request
export const deleteHabit = async (
  data: HabitDeleteRequest
): Promise<HabitDeleteResponse> => {
  try {
    const response: AxiosResponse<HabitDeleteResponse> = await axios.post(
      API_ENDPOINTS.deleteHabit,
      data
    );
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
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// get habit details by id
export const getHabitListById = async (
  data: HabitRequest
): Promise<HabitResponse> => {
  try {
    const response: AxiosResponse<HabitResponse> = await axios.get(
      `${API_ENDPOINTS.getHabitDetailsById}/${data}`
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
