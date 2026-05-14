import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Square, Trophy, Clock, Zap, Target } from 'lucide-react';

const ChallengeSession = ({ challenge, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
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

  const handleFinish = () => {
    handleStop();
    onClose({ elapsed, challengeId: challenge.id });
  };

  const difficultyColors = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400'
  };

  const difficultyBg = {
    Beginner: 'bg-green-900/30',
    Intermediate: 'bg-yellow-900/30',
    Advanced: 'bg-red-900/30'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 relative">
          <button
            onClick={() => onClose(null)}
            className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-4xl mb-2">{challenge.icon}</div>
          <h2 className="text-xl font-bold text-white">{challenge.name}</h2>
          <p className="text-yellow-100 text-sm mt-1">{challenge.description}</p>
          <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyBg[challenge.difficulty]} ${difficultyColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Stopwatch */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
              {formatTime(elapsed)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">session time</p>
          </div>

          {/* Challenge stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{challenge.progress}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">progress</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{challenge.duration}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">duration</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{challenge.participants.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">joined</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Overall Challenge Progress</span>
              <span>{challenge.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all"
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsRunning(r => !r)}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pause' : elapsed === 0 ? 'Start Session' : 'Resume'}
            </button>
            {elapsed > 0 && (
              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-xl transition"
              >
                <Square className="w-4 h-4" />
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSession;
