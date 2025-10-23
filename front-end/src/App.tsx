// App.tsx
import React, { useState, useEffect } from 'react';
import { fitnessAPI } from './api';
import type { User, DailyActivity, WorkoutPlan } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userResponse, activitiesResponse, plansResponse] = await Promise.all([
        fitnessAPI.getUser(1),
        fitnessAPI.getUserActivities(1),
        fitnessAPI.getWorkoutPlans()
      ]);

      setUser(userResponse.data);
      setActivities(activitiesResponse.data);
      setWorkoutPlans(plansResponse.data);
      
    } catch (err: any) {
      console.error('Errore nel caricamento:', err);
      setError(`Errore di connessione: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  // Funzione per calcolare la percentuale di completamento
  const calculateProgress = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
  };

  // Funzione per formattare la data
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Errore</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-yellow-500 text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nessun utente trovato</h2>
          <button 
            onClick={refreshData}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Ricarica
          </button>
        </div>
      </div>
    );
  }

  const todayActivity = activities[0];
  const stepProgress = calculateProgress(todayActivity?.steps || 0, user.daily_step_goal);
  const calorieProgress = calculateProgress(todayActivity?.calories_burned || 0, user.daily_calorie_goal);
  const standingProgress = calculateProgress(todayActivity?.standing_hours || 0, user.daily_standing_goal);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzato': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMuscleGroupColor = (group: string) => {
    const colors: { [key: string]: string } = {
      braccia: 'bg-blue-100 text-blue-800',
      gambe: 'bg-purple-100 text-purple-800',
      addominali: 'bg-orange-100 text-orange-800',
      petto: 'bg-red-100 text-red-800',
      schiena: 'bg-indigo-100 text-indigo-800',
      cardio: 'bg-teal-100 text-teal-800'
    };
    return colors[group] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <span className="text-white text-2xl">🏃‍♂️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FitnessTracker</h1>
                <p className="text-sm text-gray-500">Monitora i tuoi progressi</p>
              </div>
            </div>
            <button 
              onClick={refreshData}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Aggiorna</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Benvenuto, <span className="text-green-600">{user.username}</span>!
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(user.level)}`}>
                  📊 {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  📧 {user.email}
                </span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{user.daily_step_goal}</div>
                  <div className="text-sm text-gray-500">Passi Goal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{user.daily_calorie_goal}</div>
                  <div className="text-sm text-gray-500">Calorie Goal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{user.daily_standing_goal}h</div>
                  <div className="text-sm text-gray-500">In Piedi Goal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        {todayActivity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Steps Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">👣 Passi</h3>
                <span className={`text-sm font-medium ${stepProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {stepProgress >= 100 ? '🎉 Completato!' : `${Math.round(stepProgress)}%`}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.steps}</div>
              <div className="text-sm text-gray-500 mb-4">Obiettivo: {user.daily_step_goal} passi</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    stepProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${stepProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Calories Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🔥 Calorie</h3>
                <span className={`text-sm font-medium ${calorieProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {calorieProgress >= 100 ? '🎉 Completato!' : `${Math.round(calorieProgress)}%`}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.calories_burned}</div>
              <div className="text-sm text-gray-500 mb-4">Obiettivo: {user.daily_calorie_goal} kcal</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    calorieProgress >= 100 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${calorieProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Standing Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">⏱️ In Piedi</h3>
                <span className={`text-sm font-medium ${standingProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {standingProgress >= 100 ? '🎉 Completato!' : `${Math.round(standingProgress)}%`}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.standing_hours}h</div>
              <div className="text-sm text-gray-500 mb-4">Obiettivo: {user.daily_standing_goal}h</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    standingProgress >= 100 ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${standingProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Today's Info */}
        {todayActivity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Dettagli Giornata</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Distanza percorsa:</span>
                  <span className="font-semibold">{(todayActivity.distance_meters / 1000).toFixed(2)} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-semibold">{formatDate(todayActivity.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Efficienza:</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((stepProgress + calorieProgress + standingProgress) / 3)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Progresso Complessivo</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Passi</span>
                    <span>{Math.round(stepProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stepProgress}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calorie</span>
                    <span>{Math.round(calorieProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${calorieProgress}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Piedi</span>
                    <span>{Math.round(standingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${standingProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workout Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">💪 Schede Allenamento</h2>
            <span className="text-sm text-gray-500">{workoutPlans.length} schede disponibili</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(plan.level)}`}>
                      {plan.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(plan.muscle_group)}`}>
                      {plan.muscle_group}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-6">⏱️</span>
                      <span>{plan.duration_minutes} minuti</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-6">🔥</span>
                      <span>{plan.calories_estimate} kcal stimate</span>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-gray-600 mb-4 italic">"{plan.description}"</p>
                  )}

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                    Inizia Allenamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Storico Attività</h2>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-600 text-lg">📅</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{formatDate(activity.date)}</div>
                    <div className="text-sm text-gray-500">
                      {activity.distance_meters > 0 ? `${(activity.distance_meters / 1000).toFixed(2)} km` : 'Nessuna distanza'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{activity.steps}</div>
                    <div className="text-xs text-gray-500">Passi</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{activity.calories_burned}</div>
                    <div className="text-xs text-gray-500">Calorie</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{activity.standing_hours}h</div>
                    <div className="text-xs text-gray-500">In Piedi</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;