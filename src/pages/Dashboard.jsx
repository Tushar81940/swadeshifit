import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Footprints, TrendingUp, Trophy, Dumbbell, Activity, Target, Calendar } from 'lucide-react';
import ActivityChart from '../components/ActivityChart';
import ProgressBar from '../components/ProgressBar';
import { weeklyData, challenges } from '../utils/dummyData';
import { useAuth } from '../context/AuthContext';

const card = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl";

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const stats = [
    { label: 'Calories Burned', value: '2,850', unit: 'kcal', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900', change: '+12%' },
    { label: 'Steps Today', value: '12,547', unit: 'steps', icon: Footprints, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900', change: '+8%' },
    { label: 'Active Days', value: '24', unit: 'days', icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900', change: '+3' },
    { label: 'Workouts', value: '124', unit: 'total', icon: Dumbbell, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900', change: '+5' }
  ];

  const todayGoals = [
    { name: 'Steps', current: 12547, target: 15000, unit: 'steps' },
    { name: 'Calories', current: 2850, target: 3000, unit: 'kcal' },
    { name: 'Water', current: 6, target: 8, unit: 'glasses' },
    { name: 'Active Minutes', current: 45, target: 60, unit: 'min' }
  ];

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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
            <p className="text-green-100">You're doing great! Keep up the momentum.</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-4xl font-bold">🔥 12</p>
            <p className="text-green-100">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${card} hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.unit}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">{stat.change}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
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
          <span className="text-sm text-gray-600 dark:text-gray-400">3 of 4 completed</span>
        </div>
        <div className="space-y-4">
          {todayGoals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{goal.name}</span>
                <span className="text-gray-600 dark:text-gray-400">{goal.current} / {goal.target} {goal.unit}</span>
              </div>
              <ProgressBar progress={(goal.current / goal.target) * 100} />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className={card}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Activity</h2>
        <ActivityChart data={weeklyData} />
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
                  className={`${action.color} text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer block`}>
                  <Icon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">{action.name}</p>
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
                  <h3 className="font-semibold text-gray-900 dark:text-white">{challenge.icon} {challenge.name}</h3>
                  <span className="text-sm text-green-600 font-semibold">{challenge.progress}%</span>
                </div>
                <ProgressBar progress={challenge.progress} height="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
