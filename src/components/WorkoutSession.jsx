import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Square, Flame, Clock, Zap } from 'lucide-react';
import { workoutsAPI } from '../utils/api';

const WorkoutSession = ({ workout, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const intervalRef = useRef(null);

  // calories per second based on workout's total calories and duration
  const durationMinutes = parseInt(workout.duration) || 30;
  const calPerSecond = workout.calories / (durationMinutes * 60);

  const caloriesBurned = Math.floor(elapsed * calPerSecond);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleFinish = async () => {
    handleStop();
    try {
      await workoutsAPI.logSession({
        workoutId: workout.id,
        workoutName: workout.name,
        category: workout.category,
        difficulty: workout.difficulty,
        durationSeconds: elapsed,
        caloriesBurned: caloriesBurned
      });
    } catch {
      // session saved locally even if API fails
    }
    onClose({ elapsed, caloriesBurned });
  };

  const progress = Math.min((elapsed / (durationMinutes * 60)) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header image */}
        <div className="relative h-40">
          <img src={workout.image} alt={workout.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={() => onClose(null)}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">{workout.category}</span>
            <h2 className="text-xl font-bold text-white">{workout.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stopwatch */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
              {formatTime(elapsed)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">elapsed time</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}% of {workout.duration}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{caloriesBurned}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">cal burned</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{durationMinutes}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">min goal</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <Zap className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{workout.calories}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">cal target</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsRunning(r => !r)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
            </button>
            {elapsed > 0 && (
              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-xl transition"
              >
                <Square className="w-4 h-4" />
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
