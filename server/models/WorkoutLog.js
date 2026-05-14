const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: Number, required: true },
    workoutName: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String },
    durationSeconds: { type: Number, required: true }, // actual time spent
    caloriesBurned: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
