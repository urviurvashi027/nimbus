import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  DailyCheckInDetailResponse,
  DailyCheckInListResponse,
} from "@/types/dailyCheckin";
import axios, { AxiosResponse } from "axios";

/**
 * Fetch daily check-ins. If `date` is provided, adds the date + is_daily_checkin query.
 * @param date - "YYYY-MM-DD" (optional)
 * @param isDailyCheckIn - filter to only daily check-ins (defaults to true)
 */
export const getCheckinList = async (
  date: string,
  isDailyCheckIn: boolean = true
): Promise<DailyCheckInListResponse> => {
  try {
    const endpoint = API_ENDPOINTS.getDailyCheckInByDate(date, isDailyCheckIn);
    const { data }: AxiosResponse<DailyCheckInListResponse> = await axios.get(
      endpoint
    );
    return data;
  } catch (err: any) {
    // Bubble up a useful error message
    throw err?.response?.data ?? err?.message ?? err;
  }
};

export const getHabitDetailsByDate = async (
  habitId: number,
  date: string
): Promise<DailyCheckInDetailResponse> => {
  try {
    const endpoint = API_ENDPOINTS.getHabitDetailsByDate(habitId, date);
    const { data }: AxiosResponse<DailyCheckInDetailResponse> = await axios.get(
      endpoint
    );
    return data;
  } catch (err: any) {
    throw err?.response?.data ?? err?.message ?? err;
  }
};
