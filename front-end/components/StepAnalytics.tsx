// components/StepsAnalytics.tsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { DailyActivity } from '../src/types';

interface StepsAnalyticsProps {
  activities: DailyActivity[];
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const StepsAnalytics: React.FC<StepsAnalyticsProps> = ({ activities }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Prepara i dati per i grafici in base al timeRange selezionato
  const chartData = useMemo(() => {
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (timeRange === 'daily') {
      return sortedActivities.slice(-30).map(activity => ({
        date: new Date(activity.date).toLocaleDateString('it-IT', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        steps: activity.steps,
        calories: activity.calories_burned,
        standingHours: activity.standing_hours,
        distance: Math.round(activity.distance_meters / 1000 * 100) / 100,
        fullDate: activity.date
      }));
    }

    if (timeRange === 'weekly') {
      const weeklyData: { week: string; steps: number; calories: number; standingHours: number; distance: number; days: number }[] = [];
      
      sortedActivities.forEach(activity => {
        const date = new Date(activity.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        const existingWeek = weeklyData.find(w => w.week === weekKey);
        
        if (existingWeek) {
          existingWeek.steps += activity.steps;
          existingWeek.calories += activity.calories_burned;
          existingWeek.standingHours += activity.standing_hours;
          existingWeek.distance += activity.distance_meters / 1000;
          existingWeek.days += 1;
        } else {
          weeklyData.push({
            week: weekKey,
            steps: activity.steps,
            calories: activity.calories_burned,
            standingHours: activity.standing_hours,
            distance: activity.distance_meters / 1000,
            days: 1
          });
        }
      });

      return weeklyData.map(week => ({
        date: `Sett. ${new Date(week.week).getDate()}/${new Date(week.week).getMonth() + 1}`,
        steps: Math.round(week.steps / week.days),
        calories: Math.round(week.calories / week.days),
        standingHours: Math.round(week.standingHours / week.days),
        distance: Math.round(week.distance / week.days * 100) / 100,
        fullDate: week.week
      }));
    }

    // Monthly
    const monthlyData: { month: string; steps: number; calories: number; standingHours: number; distance: number; days: number }[] = [];
    
    sortedActivities.forEach(activity => {
      const date = new Date(activity.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      const existingMonth = monthlyData.find(m => m.month === monthKey);
      
      if (existingMonth) {
        existingMonth.steps += activity.steps;
        existingMonth.calories += activity.calories_burned;
        existingMonth.standingHours += activity.standing_hours;
        existingMonth.distance += activity.distance_meters / 1000;
        existingMonth.days += 1;
      } else {
        monthlyData.push({
          month: monthKey,
          steps: activity.steps,
          calories: activity.calories_burned,
          standingHours: activity.standing_hours,
          distance: activity.distance_meters / 1000,
          days: 1
        });
      }
    });

    return monthlyData.map(month => ({
      date: new Date(month.month + '-01').toLocaleDateString('it-IT', { 
        month: 'long', 
        year: 'numeric' 
      }),
      steps: Math.round(month.steps / month.days),
      calories: Math.round(month.calories / month.days),
      standingHours: Math.round(month.standingHours / month.days),
      distance: Math.round(month.distance / month.days * 100) / 100,
      fullDate: month.month
    }));
  }, [activities, timeRange]);

  // Statistiche riepilogative
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const stepsData = chartData.map(d => d.steps);
    const avgSteps = Math.round(stepsData.reduce((a, b) => a + b, 0) / stepsData.length);
    const maxSteps = Math.max(...stepsData);
    const minSteps = Math.min(...stepsData);
    const currentSteps = stepsData[stepsData.length - 1];

    return { avgSteps, maxSteps, minSteps, currentSteps };
  }, [chartData]);

  const ChartComponent = chartType === 'line' ? LineChart : 
                        chartType === 'bar' ? BarChart : AreaChart;
  const DataComponent = chartType === 'line' ? Line : 
                       chartType === 'bar' ? Bar : Area;

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Analisi Passi</h2>
        <div className="text-center text-gray-500 py-8">
          Nessun dato disponibile per l'analisi
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📊 Analisi Passi</h2>
        
        <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
          {/* Selettore Time Range */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Periodo:</span>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="daily">Giornaliero</option>
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
            </select>
          </div>

          {/* Selettore Tipo Grafico */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Grafico:</span>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'area')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="line">Linea</option>
              <option value="bar">Barre</option>
              <option value="area">Area</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiche Riepilogative */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.currentSteps}</div>
            <div className="text-sm text-blue-800">Passi Attuali</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.avgSteps}</div>
            <div className="text-sm text-green-800">Media</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.maxSteps}</div>
            <div className="text-sm text-orange-800">Massimo</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.minSteps}</div>
            <div className="text-sm text-purple-800">Minimo</div>
          </div>
        </div>
      )}

      {/* Grafico Principale */}
      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString('it-IT'), 'Passi']}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <DataComponent 
              type="monotone" 
              dataKey="steps" 
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={chartType === 'area' ? 0.6 : 0}
              strokeWidth={2}
              name="Passi"
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Grafici Comparativi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confronto Passi vs Calorie</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="steps" fill="#3B82F6" name="Passi" />
              <Bar dataKey="calories" fill="#EF4444" name="Calorie" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Andamento Completo</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="steps" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Passi" />
              <Area type="monotone" dataKey="distance" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Distanza (km)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabella Dati Dettagliati */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dati Dettagliati</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Passi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Calorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ore in Piedi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Distanza (km)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData.slice().reverse().map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.steps.toLocaleString('it-IT')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.calories}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.standingHours}h
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.distance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StepsAnalytics;