export type ContactCategory = "BUG" | "FEATURE" | "FEEDBACK" | "CONTACT";

export type ContactUsResponse = {
  success: boolean;
  message: string;
  data?: any;
  error_code?: string;
};

export type ContactAttachment = {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
};
