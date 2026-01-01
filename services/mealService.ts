import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

export interface Meal {
  id: number;
  title: string;
  calories: number;
  image: string | null;
  is_consumed: boolean;
}

export interface DayPlan {
  id: number;
  date: string;
  status: string;
  meals: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snacks: Meal[];
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

export interface MealDashboardResponse {
  period: string;
  days_tracked: number;
  total_calories_consumed: number;
  average_calories: number;
  today_nutrition: {
    calories: NutritionStats;
    protein: NutritionStats;
    carbs: NutritionStats;
    fats: NutritionStats;
  };
}

export const getWeeklyMealPlan = async (startDate: string): Promise<DayPlan[]> => {
  try {
    const response: AxiosResponse<DayPlan[]> = await axios.get(
      API_ENDPOINTS.getWeeklyMealPlan(startDate)
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export interface AddMealRequest {
  plan_date: string; // "YYYY-MM-DD"
  meal_type: string; // "breakfast", "lunch", "dinner", "snacks"
  recipe_id?: number;
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface MealItemResponse {
  id: number;
  name: string;
  calories: number;
  is_consumed: boolean;
}

export const getMealDashboard = async (days: number = 30): Promise<MealDashboardResponse> => {
  try {
    const response: AxiosResponse<MealDashboardResponse> = await axios.get(
      API_ENDPOINTS.getMealDashboard(days)
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addMealItem = async (data: AddMealRequest): Promise<MealItemResponse> => {
  try {
    const response: AxiosResponse<MealItemResponse> = await axios.post(
      API_ENDPOINTS.addMealItem,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};


