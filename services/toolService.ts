import axios, { AxiosResponse, AxiosError } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  ArticleData,
  ArticleDataDetails,
  ArticleListResponse,
  AudioBookListResponse,
  RecipeListResponse,
  RoutineListResponse,
  ShortVideoListResponse,
  SoundscapeListResponse,
  bodyShapeCalculatorRequest,
  bodyShapeCalculatorResponse,
  calorieCalculatorRequest,
  calorieCalculatorResponse,
  proteinIntakeCalculatorRequest,
  proteinIntakeCalculatorResponse,
} from "@/types/toolsTypes";

// get article list
// TODO: parsing data check image, source, filter functionality
export const getArticleList = async (
  category?: string
): Promise<ArticleListResponse> => {
  try {
    const endpoint = category
      ? `${API_ENDPOINTS.getArticleList}&category=${category}`
      : API_ENDPOINTS.getArticleList;
    const response: AxiosResponse<ArticleListResponse> = await axios.get(
      endpoint
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

//  TODO: Need to integrate
export const getArticleDetails = async (
  id: number
): Promise<ArticleDataDetails> => {
  try {
    const response: AxiosResponse<ArticleDataDetails> = await axios.get(
      `${API_ENDPOINTS.getArticleDetails}${id}/`
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// TODO: parsing data check image, source
export const getSoundscapeList = async (): Promise<SoundscapeListResponse> => {
  try {
    const response: AxiosResponse<SoundscapeListResponse> = await axios.get(
      API_ENDPOINTS.getSoundscapeList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getShortVideo = async (): Promise<ShortVideoListResponse> => {
  try {
    const response: AxiosResponse<ShortVideoListResponse> = await axios.get(
      API_ENDPOINTS.getShortVideoList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAudioBookList = async (): Promise<AudioBookListResponse> => {
  try {
    const response: AxiosResponse<AudioBookListResponse> = await axios.get(
      API_ENDPOINTS.getAudioBookList
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getRecipeList = async (
  category?: string
): Promise<RecipeListResponse> => {
  try {
    const endpoint = category
      ? `${API_ENDPOINTS.getRecipeList}&category=${category}`
      : API_ENDPOINTS.getRecipeList;

    const response: AxiosResponse<RecipeListResponse> = await axios.get(
      endpoint
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getRoutineList = async (
  category?: string
): Promise<RoutineListResponse> => {
  try {
    const endpoint = category
      ? `${API_ENDPOINTS.getRoutineTemplate}&category=${category}`
      : API_ENDPOINTS.getRoutineTemplate;

    const response: AxiosResponse<RoutineListResponse> = await axios.get(
      endpoint
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCalorieIntakeInfo = async (
  data: calorieCalculatorRequest
): Promise<calorieCalculatorResponse> => {
  try {
    const response: AxiosResponse<calorieCalculatorResponse> = await axios.post(
      API_ENDPOINTS.calorieCalculator,
      data
    );
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getProteinIntakeInfo = async (
  data: proteinIntakeCalculatorRequest
): Promise<proteinIntakeCalculatorResponse> => {
  try {
    const response: AxiosResponse<proteinIntakeCalculatorResponse> =
      await axios.post(API_ENDPOINTS.proteinIntakeCalculator, data);
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getBodyShapeInfo = async (
  data: bodyShapeCalculatorRequest
): Promise<bodyShapeCalculatorResponse> => {
  try {
    const response: AxiosResponse<bodyShapeCalculatorResponse> =
      await axios.post(API_ENDPOINTS.bodyShapeCalculator, data);
    return response.data; // Return the list data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
