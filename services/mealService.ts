import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { toApiDate } from "@/utils/dateTime";

export interface Meal {
  id: number;
  name: string;
  calories?: number;
  image: string | null;
  is_consumed: boolean;
  plan?: number;
  meal_type?: string;
  recipe?: number;
}

export interface DayPlan {
  id: number;
  date: string;
  status: string;
  meals: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snacks: Meal[] | null;
  };
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
}

export interface NutritionStats {
  consumed: number;
  goal: number;
  color: string;
}

export interface MealDashboardData {
  period: string;
  days_tracked?: number;
  total_calories_consumed?: number;
  average_calories?: number;
  today_nutrition: {
    calories: NutritionStats;
    protein: NutritionStats;
    carbs: NutritionStats;
    fats: NutritionStats;
    fiber: NutritionStats;
  };
}

export interface MealDashboardResponse {
  success: boolean;
  message: string;
  data: MealDashboardData;
}

export const getWeeklyMealPlan = async (
  startDate: Date
): Promise<DayPlan[]> => {
  try {
    const formattedDate = toApiDate(startDate);
    const response: AxiosResponse<DayPlan[]> = await axios.get(
      API_ENDPOINTS.getWeeklyMealPlan(formattedDate)
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getDailyMealPlan = async (date?: Date): Promise<any> => {
  try {
    const formattedDate = date ? toApiDate(date) : undefined;
    const response = await axios.get(
      API_ENDPOINTS.getDailyMealPlan(formattedDate)
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMealPlanRange = async (
  startDate: Date,
  endDate: Date
): Promise<any> => {
  try {
    const start = toApiDate(startDate);
    const end = toApiDate(endDate);
    const response = await axios.get(
      `${API_ENDPOINTS.getDailyMealPlan("range").split("?")[0]}?start_date=${start}&end_date=${end}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMealDashboard = async (
  days: number = 30
): Promise<MealDashboardResponse> => {
  try {
    const response: AxiosResponse<MealDashboardResponse> = await axios.get(
      API_ENDPOINTS.getMealDashboard(days)
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export interface AddMealRequest {
  date: Date;
  meal_type: string;
  recipe_id?: number | string;
  name?: string;
  calories?: number;
  protein?: number;
  fiber?: number;
}

export interface MealItemResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    plan: number;
    meal_type: string;
    name: string;
    calories: number;
    is_consumed: boolean;
  };
}

export interface BulkMealUpdatePayload {
  [date: string]: {
    [mealType: string]: {
      recipe_id?: number | string;
      name?: string;
      calories?: number;
    } | null;
  };
}

export const addMealItem = async (
  data: AddMealRequest
): Promise<MealItemResponse> => {
  try {
    const payload = {
      ...data,
      date: toApiDate(data.date),
    };
    const response: AxiosResponse<MealItemResponse> = await axios.post(
      API_ENDPOINTS.addMealItem,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const bulkUpdateMealPlan = async (
  data: BulkMealUpdatePayload
): Promise<any> => {
  try {
    const response = await axios.post(API_ENDPOINTS.bulkUpdateMealPlan, data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMealPlanPdfUrl = (startDate: string, endDate: string): string => {
  return API_ENDPOINTS.getMealPlanPdf(startDate, endDate);
};