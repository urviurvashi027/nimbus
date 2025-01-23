export interface HabitItem {
  id: number;
  name: string;
  // Add other fields that are returned in your list items
}

export interface HabitListResponse {
  data: HabitItem[];
}

export interface HabitCreateRequest {
  taskName: string;
  color: string;
  icon: string;
  startDate: string;
  endDate: string;
  metric: any;
  frequency: any;
  tags: any;
  subtask: any;
  type: any;
  startTime: any;
  endTime: any;
  reminderAt: any;
  beforeNotification: any;
}

export interface HabitCreateResponse {
  id: number;
  name: string;
  icon: string;
  subtask: string;
}

export interface HabitDeleteResponse {
  message: string;
  data: HabitItem[];
}

export interface HabitDeleteRequest {
  id: string;
}

export interface HabitDoneResponse {
  message: string;
  data: HabitItem[];
}

export interface HabitDoneRequest {
  id: string;
}

export interface HabitResponse {
  message: string;
  data: any;
}

export interface HabitRequest {
  id: string;
}
