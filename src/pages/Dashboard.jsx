import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Footprints, TrendingUp, Trophy, Dumbbell, Activity, Target, Calendar } from 'lucide-react';
import ActivityChart from '../components/ActivityChart';
import ProgressBar from '../components/ProgressBar';
import { challenges } from '../utils/dummyData';
import { useAuth } from '../context/AuthContext';
import { workoutsAPI, profileAPI } from '../utils/api';

const card = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl";

const emptyWeekly = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
  day, calories: 0, steps: 0
}));

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const [profile, setProfile] = useState(null);
  const [weeklyData, setWeeklyData] = useState(emptyWeekly);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, stats] = await Promise.all([
          profileAPI.getMe(),
          workoutsAPI.getStats()
        ]);
        setProfile(prof);
        updateUser({ currentStreak: prof.currentStreak, name: prof.name });
        // merge real calorie data into weekly structure
        const merged = emptyWeekly.map((d, i) => ({
          ...d,
          calories: stats[i]?.calories ?? 0
        }));
        setWeeklyData(merged);
      } catch {
        // API unavailable — keep zeros
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalWorkouts = profile?.totalWorkouts ?? 0;
  const totalCalories = profile?.totalCalories ?? 0;
  const currentStreak = profile?.currentStreak ?? user?.currentStreak ?? 0;

  const stats = [
    {
      label: 'Calories Burned', value: totalCalories.toLocaleString(),
      unit: 'kcal', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900',
      sub: totalCalories === 0 ? 'No workouts yet' : 'all time'
    },
    {
      label: 'Steps Today', value: '0',
      unit: 'steps', icon: Footprints, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900',
      sub: 'Start moving!'
    },
    {
      label: 'Active Days', value: currentStreak > 0 ? String(currentStreak) : '0',
      unit: 'day streak', icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900',
      sub: currentStreak === 0 ? 'Start your streak' : `${currentStreak} days strong`
    },
    {
      label: 'Workouts', value: String(totalWorkouts),
      unit: 'total', icon: Dumbbell, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900',
      sub: totalWorkouts === 0 ? 'Do your first workout!' : `${totalWorkouts} completed`
    }
  ];

  const todayGoals = [
    { name: 'Steps', current: 0, target: 10000, unit: 'steps' },
    { name: 'Calories', current: totalCalories > 0 ? Math.min(totalCalories, 3000) : 0, target: 3000, unit: 'kcal' },
    { name: 'Water', current: 0, target: 8, unit: 'glasses' },
    { name: 'Active Minutes', current: totalWorkouts > 0 ? 30 : 0, target: 60, unit: 'min' }
  ];

  const completedGoals = todayGoals.filter(g => g.current >= g.target).length;

  const quickActions = [
    { name: 'Start Workout', icon: Dumbbell, link: '/workouts', color: 'bg-green-600' },
    { name: 'Log Activity', icon: Activity, link: '/activity', color: 'bg-blue-600' },
    { name: 'Join Challenge', icon: Trophy, link: '/challenges', color: 'bg-yellow-600' },
    { name: 'View Progress', icon: TrendingUp, link: '/profile', color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {totalWorkouts === 0 ? `Welcome, ${firstName}! 🎉` : `Welcome back, ${firstName}! 👋`}
            </h1>
            <p className="text-green-100">
              {totalWorkouts === 0
                ? "Let's start your fitness journey today."
                : "You're doing great! Keep up the momentum."}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-4xl font-bold">🔥 {currentStreak}</p>
            <p className="text-green-100">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${card} hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {loading ? '—' : stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.unit}</p>
                  <p className="text-xs sm:text-sm text-green-600 font-medium mt-1 truncate">{stat.sub}</p>
                </div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-full flex items-center justify-center flex-shrink-0 ml-2`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Goals */}
      <div className={card}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-green-600" /> Today's Goals
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedGoals} of {todayGoals.length} completed
          </span>
        </div>
        <div className="space-y-4">
          {todayGoals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{goal.name}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <ProgressBar progress={Math.min((goal.current / goal.target) * 100, 100)} />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className={card}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Activity</h2>
        {totalWorkouts === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No activity yet this week.</p>
            <Link to="/workouts" className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm">
              Start your first workout →
            </Link>
          </div>
        ) : (
          <ActivityChart data={weeklyData} />
        )}
      </div>

      {/* Quick Actions & Challenges */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={card}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}
                  className={`${action.color} text-white p-5 sm:p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer block`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                  <p className="font-semibold text-sm sm:text-base">{action.name}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Challenges</h2>
            <Link to="/challenges" className="text-sm text-green-600 hover:text-green-700 font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {challenges.slice(0, 3).map((challenge) => (
              <div key={challenge.id} className="border-l-4 border-green-600 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {challenge.icon} {challenge.name}
                  </h3>
                  <span className="text-sm text-green-600 font-semibold">0%</span>
                </div>
                <ProgressBar progress={0} height="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
