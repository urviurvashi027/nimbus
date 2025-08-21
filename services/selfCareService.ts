import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  JournalEntryListResponse,
  JournalListResponse,
  JournalSubmitRequest,
  JournalSubmitResponse,
  MeditationVideoListResponse,
  MentalTestListResponse,
  WorkoutVideoListResponse,
} from "@/types/selfCareTypes";

export const getJournalList = async (): Promise<JournalListResponse> => {
  try {
    const response: AxiosResponse<JournalListResponse> = await axios.get(
      API_ENDPOINTS.getJournalList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const submitJournalEntry = async (
  data: JournalSubmitRequest
): Promise<JournalSubmitResponse> => {
  try {
    const response: AxiosResponse<JournalSubmitResponse> = await axios.post(
      API_ENDPOINTS.submitJournal,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getJournalEntry = async (): Promise<JournalEntryListResponse> => {
  try {
    const response: AxiosResponse<JournalEntryListResponse> = await axios.get(
      API_ENDPOINTS.getJournalEntry
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// TODO ADD API FOR DETAILS, SUBMIT, RESULT
export const getMentalTestList = async (): Promise<MentalTestListResponse> => {
  try {
    const response: AxiosResponse<MentalTestListResponse> = await axios.get(
      API_ENDPOINTS.getMentalTestList
    );
    console.log(response, "medical test");
    return response; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getWorkoutVideo = async (): Promise<WorkoutVideoListResponse> => {
  try {
    const response: AxiosResponse<WorkoutVideoListResponse> = await axios.get(
      API_ENDPOINTS.getWorkoutVideoList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// filteration not working
// card Color
export const getMeditationAudioList =
  async (): Promise<MeditationVideoListResponse> => {
    try {
      const response: AxiosResponse<MeditationVideoListResponse> =
        await axios.get(API_ENDPOINTS.getMeditationList);
      return response.data; // Return the list data
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  };
