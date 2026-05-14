import React, { useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeSession from '../components/ChallengeSession';
import { challenges, leaderboard } from '../utils/dummyData';

const card = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl";

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [activeChallenge, setActiveChallenge] = useState(null);

  const handleSessionClose = () => setActiveChallenge(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {activeChallenge && (
        <ChallengeSession challenge={activeChallenge} onClose={handleSessionClose} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Fitness Challenges</h1>
            <p className="text-yellow-100 text-sm sm:text-base">Compete, achieve, and unlock your potential</p>
          </div>
          <Trophy className="w-10 h-10 sm:w-16 sm:h-16 opacity-50 flex-shrink-0" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {[
          { icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900', value: '4', label: 'Active' },
          { icon: Medal, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900', value: '12', label: 'Completed' },
          { icon: Award, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900', value: '2,380', label: 'Points' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${card} text-center`}>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className={card}>
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['active', 'upcoming', 'completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 sm:px-4 text-sm sm:text-base font-medium capitalize whitespace-nowrap transition-colors flex-1 sm:flex-none ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}>
              <span className="hidden sm:inline">{tab} Challenges</span>
              <span className="sm:hidden capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {challenges.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge}
            onJoin={(c) => setActiveChallenge(c)} />
        ))}
      </div>

      {/* Leaderboard */}
      <div className={card}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" /> Global Leaderboard
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {leaderboard.map((user) => (
            <div key={user.rank}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all ${
                user.isCurrentUser
                  ? 'bg-green-50 dark:bg-green-900 border-2 border-green-600'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}>
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                  user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                  user.rank === 2 ? 'bg-gray-300 text-gray-900' :
                  user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                  'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>{user.rank}</div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {user.name}
                    {user.isCurrentUser && <span className="ml-1 sm:ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">You</span>}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{user.points} pts</p>
                </div>
              </div>
              {user.rank <= 3 && (
                <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-400' : 'text-orange-400'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
