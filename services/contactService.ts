import axios, { AxiosResponse } from "axios";
// import * as Mime from "mime";
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
  ContactCategory,
  ContactAttachment,
  ContactUsResponse,
} from "@/types/contactTypes";

function guessImageTypeFromName(name?: string) {
  const n = (name ?? "").toLowerCase();
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".heic")) return "image/heic";
  return "image/jpeg";
}

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

    console.log("File size (bytes):", payload.screenshot?.size);

    if (payload.screenshot?.uri) {
      const name = payload.screenshot.name || "screenshot.jpg";
      const type = payload.screenshot.mimeType || guessImageTypeFromName(name);

      form.append("screenshot", {
        uri: payload.screenshot.uri,
        name,
        type,
      } as any);
    }
    console.log(form, "formdata");
    const res: AxiosResponse<ContactUsResponse> = await axios.post(
      API_ENDPOINTS.contactUs, // ✅ add this endpoint
      form,
      {
        // ✅ let axios set boundary; don't set Content-Type manually
        headers: {
          Accept: "application/json",
        },
      }
      // { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}
