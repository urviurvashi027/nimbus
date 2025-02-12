// TODO add Habit Data

interface HabitData {
  data: any;
}

export interface HabitItem {
  id: number;
  name: string;
  // Add other fields that are returned in your list items
}

export interface HabitListResponse {
  success: string;
  message: string;
  data: any;
  error?: any;
}

interface HabitMetric {
  unit: string;
  count: number;
}

// 3 case start, strat and end or all day
interface HabitDuration {
  start_time?: string;
  end_time?: string;
  all_day?: boolean;
}

// TODO dayofweek dateofMonths
interface HabitFrequency {
  frequency_type: string;
  interval: number;
  start_date: string;

  days_of_week?: string[];
  days_of_month?: string[];
  end_date?: string;
}

interface ReminderAt {
  // remind_at: string;
  time?: string;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface HabitCreateRequest {
  name: string;
  description?: string;
  habit_type_id: number;
  color: string;
  tags: string[];
  habit_metric: HabitMetric;
  habit_duration: AtLeastOne<HabitDuration>;
  habit_frequency: HabitFrequency;
  remind_at: AtLeastOne<ReminderAt>;
  subtasks: string[];
}

export interface HabitCreateResponse {
  success: string;
  message: string;
  data: HabitData;
  error?: string;
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
  success: string;
  message: string;
  data: any;
}

export interface HabitRequest {
  id: string;
}
