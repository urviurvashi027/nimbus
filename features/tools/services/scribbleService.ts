// services/scribbleService.ts
import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

export interface Scribble {
  id: string | number;
  title: string;
  content: string;
  tags: string[];
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScribbleCreateRequest {
  title: string;
  content: string;
  tag_list: string[];
  date?: string;
}

export interface ScribbleResponse {
  success: boolean;
  message: string;
  data: Scribble;
  status: number;
}

export interface ScribbleListResponse {
  success: boolean;
  message: string;
  data: Scribble[];
}

export interface RecentTagsResponse {
  success: boolean;
  message: string;
  data: string[];
  status: number;
}

export const scribbleService = {
  // Create a new scribble
  saveScribble: async (request: ScribbleCreateRequest): Promise<Scribble> => {
    try {
      const response: AxiosResponse<ScribbleResponse> = await axios.post(
        API_ENDPOINTS.scribbles,
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get all scribbles
  getScribbles: async (params?: {
    tag?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    ordering?: string;
  }): Promise<Scribble[]> => {
    try {
      const response: AxiosResponse<ScribbleListResponse> = await axios.get(
        API_ENDPOINTS.scribbles,
        { params }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching scribbles:", error);
      return [];
    }
  },

  // Get single scribble
  getScribbleById: async (id: string | number): Promise<Scribble | null> => {
    try {
      const response: AxiosResponse<ScribbleResponse> = await axios.get(
        `${API_ENDPOINTS.scribbles}${id}/`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching scribble by id:", error);
      return null;
    }
  },

  // Get recent tags
  getRecentTags: async (): Promise<string[]> => {
    try {
      const response: AxiosResponse<RecentTagsResponse> = await axios.get(
        API_ENDPOINTS.recentScribbleTags
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching recent tags:", error);
      return [];
    }
  },

  // Update a scribble
  updateScribble: async (
    id: string | number,
    updatedScribble: Partial<ScribbleCreateRequest>
  ): Promise<void> => {
    try {
      await axios.patch(`${API_ENDPOINTS.scribbles}${id}/`, updatedScribble);
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete a scribble
  deleteScribble: async (id: string | number): Promise<void> => {
    try {
      await axios.delete(`${API_ENDPOINTS.scribbles}${id}/`);
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  },
};
