import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import WorkoutCard from '../components/WorkoutCard';
import WorkoutSession from '../components/WorkoutSession';
import { workouts } from '../utils/dummyData';

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeWorkout, setActiveWorkout] = useState(null);

  const handleSessionClose = (result) => {
    setActiveWorkout(null);
    // result contains { elapsed, caloriesBurned } if finished, or null if dismissed
  };

  const categories = ['All', 'Strength', 'Cardio', 'Yoga', 'Sports Training'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || w.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all";
  const card = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6";

  return (
    <div className="space-y-6">
      {activeWorkout && (
        <WorkoutSession workout={activeWorkout} onClose={handleSessionClose} />
      )}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Workout Library</h1>
        <p className="text-green-100">Discover workouts tailored for your fitness goals</p>
      </div>

      <div className={card}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search workouts..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10`} />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputClass}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className={inputClass}>
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredWorkouts.length}</span> workouts
        </p>
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm">More Filters</span>
        </button>
      </div>

      {filteredWorkouts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout}
              onStart={(w) => setActiveWorkout(w)} />
          ))}
        </div>
      ) : (
        <div className={`${card} text-center py-12`}>
          <p className="text-gray-600 dark:text-gray-400 text-lg">No workouts found matching your criteria</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
            className="mt-4 text-green-600 hover:text-green-700 font-medium">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Workouts;
