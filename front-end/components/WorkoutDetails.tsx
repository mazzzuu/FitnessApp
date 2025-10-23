// components/WorkoutDetail.tsx
import React from 'react';
import type { WorkoutPlan, Exercise } from '../src/types';

interface WorkoutDetailProps {
  workoutPlan: WorkoutPlan;
  exercises: Exercise[];
  onClose: () => void;
  onStartWorkout: (workoutPlan: WorkoutPlan) => void;
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ 
  workoutPlan, 
  exercises, 
  onClose,
  onStartWorkout 
}) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{workoutPlan.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Livello</div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(workoutPlan.level)} mt-1`}>
                {workoutPlan.level}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Gruppo Muscolare</div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(workoutPlan.muscle_group)} mt-1`}>
                {workoutPlan.muscle_group}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Durata</div>
              <div className="font-semibold text-gray-900 mt-1">{workoutPlan.duration_minutes} minuti</div>
            </div>
          </div>

          {workoutPlan.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 italic">{workoutPlan.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Esercizi</h3>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {index + 1}. {exercise.name}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMuscleGroupColor(exercise.muscle_group)}`}>
                      {exercise.muscle_group}
                    </span>
                  </div>
                  
                  {exercise.description && (
                    <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {exercise.sets && (
                      <div className="bg-green-50 p-2 rounded text-center">
                        <div className="text-gray-600 text-xs">Serie</div>
                        <div className="font-semibold text-green-700">{exercise.sets}</div>
                      </div>
                    )}
                    {exercise.reps && (
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <div className="text-gray-600 text-xs">Ripetizioni</div>
                        <div className="font-semibold text-blue-700">{exercise.reps}</div>
                      </div>
                    )}
                    {exercise.duration_seconds && (
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <div className="text-gray-600 text-xs">Durata</div>
                        <div className="font-semibold text-purple-700">{exercise.duration_seconds}s</div>
                      </div>
                    )}
                    {exercise.rest_seconds && (
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <div className="text-gray-600 text-xs">Recupero</div>
                        <div className="font-semibold text-orange-700">{exercise.rest_seconds}s</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => onStartWorkout(workoutPlan)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Inizia Allenamento
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;