export interface ReportBugPayload {
  title: string;
  description: string;
  severity: string;
  os: string;
  device: string;
}

export interface ReportBugResponse {
  success: string;
  message: string;
  error_code?: string;
  data: {
    id: number;
    user: number;
    email: string | null;
    title: string;
    description: string;
    steps_to_reproduce: string | null;
    severity: string;
    app_version: string | null;
    os: string;
    device: string;
    created_at: string;
    attachments: string[];
  };
}

export interface FeedbackPayload {
  message: string;
  rating: number;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user: number;
    email: string | null;
    rating: number;
    message: string;
    source: string | null;
    created_at: string;
    attachments: string[];
  };
  error_code?: string;
}
