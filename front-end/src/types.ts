// types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  level: 'principiante' | 'intermedio' | 'avanzato';
  daily_step_goal: number;
  daily_calorie_goal: number;
  daily_standing_goal: number;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: number;
  user_id: number;
  date: string;
  steps: number;
  calories_burned: number;
  standing_hours: number;
  distance_meters: number;
  created_at: string;
}

export interface WorkoutPlan {
  id: number;
  name: string;
  level: 'principiante' | 'intermedio' | 'avanzato';
  muscle_group: 'braccia' | 'gambe' | 'addominali' | 'petto' | 'schiena' | 'cardio';
  duration_minutes: number;
  calories_estimate: number;
  description: string | null;
  created_at: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  muscle_group: 'braccia' | 'gambe' | 'addominali' | 'petto' | 'schiena' | 'cardio';
  difficulty: 'principiante' | 'intermedio' | 'avanzato';
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
  created_at: string;
  exercise_order?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}