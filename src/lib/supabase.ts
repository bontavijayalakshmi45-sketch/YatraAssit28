import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type TravelType = 'spiritual' | 'adventure' | 'heritage' | 'beach' | 'wildlife';
export type TripStatus = 'draft' | 'planned' | 'ongoing' | 'completed';
export type Language = 'english' | 'hindi' | 'telugu';
export type MessageRole = 'user' | 'assistant';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  travel_type: TravelType;
  travelers_count: number;
  itinerary: Itinerary;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  language: Language;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  created_at: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  category: TravelType;
  description: string;
  highlights: string[];
  best_time_to_visit: string;
  average_budget: number;
  image_url: string;
  rating: number;
  created_at: string;
}

export interface UserPreferences {
  language: Language;
  currency: string;
  travel_styles: TravelType[];
  favorite_destinations: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: MealPlan;
  accommodation: string;
  notes: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
}

export interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export type Itinerary = ItineraryDay[];

export interface MessageMetadata {
  destinations?: Destination[];
  budget?: BudgetBreakdown;
  tripId?: string;
  intent?: string;
}

export interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: string;
}
