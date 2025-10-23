// FitnessDashboard.tsx
import React, { useState, useEffect } from 'react';
import { fitnessAPI } from './api';
import type { User, DailyActivity, WorkoutPlan } from './types';

const FitnessDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [userResponse, activitiesResponse, plansResponse] = await Promise.all([
          fitnessAPI.getUser(1), // ID utente di esempio
          fitnessAPI.getUserActivities(1),
          fitnessAPI.getWorkoutPlans('intermedio')
        ]);

        setUser(userResponse.data);
        setActivities(activitiesResponse.data);
        setWorkoutPlans(plansResponse.data);
      } catch (err) {
        setError('Errore nel caricamento dei dati');
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!user) return <div>Nessun utente trovato</div>;

  const todayActivity = activities[0]; // La più recente

  return (
    <div className="fitness-dashboard">
      <h1>Dashboard Fitness</h1>
      
      <div className="user-info">
        <h2>Benvenuto, {user.username}</h2>
        <p>Livello: {user.level}</p>
        <p>Obiettivo giornaliero: {user.daily_step_goal} passi</p>
      </div>

      <div className="today-stats">
        <h3>Oggi</h3>
        {todayActivity && (
          <div>
            <p>Passi: {todayActivity.steps} / {user.daily_step_goal}</p>
            <p>Calorie: {todayActivity.calories_burned} / {user.daily_calorie_goal}</p>
            <p>Ore in piedi: {todayActivity.standing_hours} / {user.daily_standing_goal}</p>
            <p>Distanza: {(todayActivity.distance_meters / 1000).toFixed(2)} km</p>
          </div>
        )}
      </div>

      <div className="workout-plans">
        <h3>Schede Allenamento</h3>
        {workoutPlans.map(plan => (
          <div key={plan.id} className="workout-plan">
            <h4>{plan.name}</h4>
            <p>Livello: {plan.level}</p>
            <p>Gruppo muscolare: {plan.muscle_group}</p>
            <p>Durata: {plan.duration_minutes} minuti</p>
            <p>Calorie stimate: {plan.calories_estimate}</p>
            {plan.description && <p>Descrizione: {plan.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessDashboard;