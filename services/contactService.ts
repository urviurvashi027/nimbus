import axios, { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  ContactCategory,
  ContactAttachment,
  ContactUsResponse,
} from "@/types/contactTypes";

export type ContactUsRequest = {
  category: ContactCategory;
  subject: string;
  message: string;
  device?: string;
  os?: string;
  screenshot?: ContactAttachment | null;
};

export async function contactUs(
  payload: ContactUsRequest
): Promise<ContactUsResponse> {
  try {
    const form = new FormData();
    form.append("category", payload.category);
    form.append("subject", payload.subject);
    form.append("message", payload.message);

    if (payload.device) form.append("device", payload.device);
    if (payload.os) form.append("os", payload.os);

    if (payload.screenshot?.uri) {
      form.append("attachment", {
        uri: payload.screenshot.uri,
        name: payload.screenshot.name,
        type: payload.screenshot.mimeType || "application/octet-stream",
      } as any);
    }

    const res: AxiosResponse<ContactUsResponse> = await axios.post(
      API_ENDPOINTS.contactUs, // ✅ add this endpoint
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}
