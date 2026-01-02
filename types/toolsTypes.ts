// UI data Type

export interface SoundscapeTrackListItem {
  id: number;
  title: string;
  image: { uri: string };
  category: string;
  duration: number | string;
  description: string;
  source: string;
}

// Backend Data Type

// TODO add types

// TODO ADD PROPER TYPE
interface ArticleListItem {
  id: number;
  title: string;
  image: string;
}

export interface ArticleListResponse {
  data: ArticleListItem[];
  success: boolean;
  message: string;
  error_code?: string;
}
...
export interface SoundscapeListResponse {
  data: SoundscapeListItem[];
  success: boolean;
  message: string;
  error_code?: string;
}

export interface ShortVideoListResponse {
  data: ShortVideoItem[];
  success: boolean;
  message: string;
  error_code?: string;
}

export interface AudioBookListResponse {
  data: AudioBookItem[];
  success: boolean;
  message: string;
  error_code?: string;
}

export interface RecipeListResponse {
  data: RecipeItem[];
  success: boolean;
  message: string;
  error_code?: string;
}

export interface RoutineItem {
  id: number;
  name: string;
  image: string | null;
  category: string;
  description: string;
  blueprints?: any[];
  sections?: any[];
}

export interface RoutineListResponse {
  success: boolean;
  message: string;
  data: RoutineItem[];
}

export interface RoutineDataDetails {
  success: boolean;
  message: string;
  data: RoutineItem;
}

export interface calorieCalculatorRequest {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
}

export interface calorieCalculatorResponse {
  basalMetabolicRate: number;
  maintenanceCalories: number;
  goals: {
    mildWeightLoss: {
      calories: number;
    };
    weightLoss: {
      calories: number;
    };
    mildWeightGain: {
      calories: number;
    };
    weightGain: {
      calories: number;
    };
  };
}

export interface proteinIntakeCalculatorRequest {
  weight: string;
  // gender: string;
  activityLevel: string;
}

export interface proteinIntakeCalculatorResponse {
  activityLevel: string;
  recommendedIntake: {
    grams: number;
  };
  generalRange: {
    minimumGrams: number;
    highActivityGrams: number;
  };
}

export interface bodyShapeCalculatorRequest {
  bust: string;
  waist: string;
  highHip: string;
  lowHip: string;
}

export interface bodyShapeCalculatorResponse {
  shape: string;
  measurements: {
    bust: number;
    waist: number;
    hips: number;
  };
}

export type Meditations = {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio
  category: string;
  isLocked: boolean;
};
