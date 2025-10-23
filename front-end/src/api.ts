// api.ts
import axios from 'axios';
import type { 
  User, 
  DailyActivity, 
  WorkoutPlan, 
  Exercise, 
  ApiResponse,
  LoginResponse 
} from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fitnessAPI = {
  // Auth
  login: (email: string, password: string): Promise<LoginResponse> => 
    api.post('/login', { email, password }).then(response => response.data),

  // Users
  getUsers: (): Promise<ApiResponse<User[]>> => 
    api.get('/users').then(response => response.data),

  getUser: (id: number): Promise<ApiResponse<User>> => 
    api.get(`/users/${id}`).then(response => response.data),
  
  // Activities
  getUserActivities: (userId: number): Promise<ApiResponse<DailyActivity[]>> => 
    api.get(`/activities/user/${userId}`).then(response => response.data),

  addActivity: (activityData: Omit<DailyActivity, 'id' | 'created_at'>): Promise<ApiResponse<{id: number}>> => 
    api.post('/activities', activityData).then(response => response.data),
  
  // Workout Plans
  getWorkoutPlans: (level?: string, muscleGroup?: string): Promise<ApiResponse<WorkoutPlan[]>> => {
    const params: { level?: string; muscle_group?: string } = {};
    if (level) params.level = level;
    if (muscleGroup) params.muscle_group = muscleGroup;
    return api.get('/workout-plans', { params }).then(response => response.data);
  },
  
  getWorkoutPlanExercises: (planId: number): Promise<ApiResponse<Exercise[]>> => 
    api.get(`/workout-plans/${planId}/exercises`).then(response => response.data),
};

export default api;