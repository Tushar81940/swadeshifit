import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Flame, X } from 'lucide-react';
import Button from '../components/Button';
import ActivityChart from '../components/ActivityChart';
import { activities, weeklyData } from '../utils/dummyData';

const card = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl";
const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base";

const Activity = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Running', duration: '', distance: '',
    date: new Date().toISOString().split('T')[0]
  });

  const activityTypes = ['Running', 'Walking', 'Cycling', 'Gym', 'Yoga', 'Swimming'];
  const icons = { Running: '🏃', Walking: '🚶', Cycling: '🚴', Gym: '💪', Yoga: '🧘', Swimming: '🏊' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setFormData({ type: 'Running', duration: '', distance: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Activity Tracker</h1>
            <p className="text-blue-100 text-sm sm:text-base">Log and monitor your fitness activities</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex-shrink-0 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Log Activity</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: 'Total Activities', value: '28', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' },
          { label: 'Total Distance', value: '156 km', icon: MapPin, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' },
          { label: 'Total Time', value: '42 hrs', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900' },
          { label: 'Calories Burned', value: '18.5K', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={card}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.bg} rounded-full flex items-center justify-center flex-shrink-0 ml-2`}>
                  <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className={card}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Weekly Progress</h2>
        <div className="w-full overflow-x-auto">
          <ActivityChart data={weeklyData} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className={card}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Recent Activities</h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="text-2xl sm:text-3xl flex-shrink-0">{icons[activity.type] || '🏃'}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{activity.type}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm flex-shrink-0">
                {activity.distance > 0 && (
                  <div className="text-center hidden sm:block">
                    <p className="font-semibold text-gray-900 dark:text-white">{activity.distance} km</p>
                    <p className="text-gray-500 dark:text-gray-400">Distance</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{activity.duration} min</p>
                  <p className="text-gray-500 dark:text-gray-400">Duration</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-orange-600">{activity.calories}</p>
                  <p className="text-gray-500 dark:text-gray-400">cal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Log New Activity</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputClass} required>
                  {activityTypes.map(t => <option key={t} value={t}>{icons[t]} {t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className={inputClass} placeholder="30" required min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distance (km) — Optional</label>
                <input type="number" step="0.1" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  className={inputClass} placeholder="5.0" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClass} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition">
                  Log Activity
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
