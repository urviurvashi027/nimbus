interface UserData {
  username: string;
  email: string;
  id: number;
  refresh: string;
  access: string;
}

// TODO add types
interface LogoutData {
  data: any;
}

interface SignupData {
  id: number;
  title: string;
  image: string;
}

// TODO ADD PROPER TYPE
interface ArticleListItem {
  id: number;
  title: string;
  image: string;
}

export interface ArticleListResponse {
  data: ArticleListItem[];
}

// Type for the object inside the 'meta_info' property
interface MetaInfo {
  time: string;
  points: number;
}

// Type for the object inside the 'author_info' property
interface AuthorInfo {
  name: string;
}

// Type for the objects inside the 'section_data' array
interface SectionData {
  title: string;
  content: string;
}

// Type for the objects inside the 'section_data' array
interface IngredientsData {
  item: string;
  quantity: string;
}

// Type for the objects inside the 'section_data' array
interface InstructionData {
  step: number;
  recipe: string;
  instruction: string;
}

// The main type for the entire JSON object
export interface ArticleData {
  id: number;
  routine_items: any[]; // The structure of items is unknown, so 'any' is used
  image: any;
  source: string;
  type: string;
  title: string;
  coach_name: string | null;
  description: string;
  duration: number;
  category: string;
  ingredients: IngredientsData | null;
  instructions: InstructionData | null;
  nutrition: string | null;
  meta_info: MetaInfo | null;
  author_info: AuthorInfo | null;
  section_data: SectionData[];
  affiliate_url: string | null;
  price: number | null;
  brand: string | null;
  notes: string | null;
  created_at: string; // Or Date if you plan to parse it
  updated_at: string; // Or Date
  deleted_at: string | null; // Or Date | null
}

export interface ArticleDataDetails {
  data: ArticleData;
}

export interface SoundscapeListItem {
  id: number;
  title: string;
  image: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface SoundscapeListResponse {
  data: SoundscapeListItem[];
}

export interface ShortVideoItem {
  id: number;
  title: string;
  image: string;
  // category: string;
  // duration: number;
  // description: string;
  source: string;
}

export interface ShortVideoListResponse {
  data: ShortVideoItem[];
}

export interface AudioBookItem {
  id: number;
  title: string;
  image: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface AudioBookListResponse {
  data: AudioBookItem[];
}

export interface RecipeItem {
  id: number;
  title: string;
  image: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface RecipeListResponse {
  data: RecipeItem[];
}

export interface RoutineItem {
  id: number;
  title: string;
  image: string;
  category: string;
  duration: number;
  description: string;
  source: string;
}

export interface RoutineListResponse {
  data: RoutineItem[];
}
