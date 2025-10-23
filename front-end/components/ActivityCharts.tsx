// components/ActivityCharts.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { DailyActivity } from '../src/types';

interface ActivityChartsProps {
  activities: DailyActivity[];
}

const ActivityCharts: React.FC<ActivityChartsProps> = ({ activities }) => {
  const chartData = activities
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(activity => ({
      date: new Date(activity.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      steps: activity.steps,
      calories: activity.calories_burned,
      standingHours: activity.standing_hours,
      distance: activity.distance_meters / 1000
    }));

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Andamento Attività</h2>
        <div className="text-center text-gray-500 py-8">
          Nessun dato disponibile per visualizzare i grafici
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Andamento Attività</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Passi Giornalieri</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="steps" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorie Bruciate</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ore in Piedi</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="standingHours" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distanza (km)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="distance" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActivityCharts;