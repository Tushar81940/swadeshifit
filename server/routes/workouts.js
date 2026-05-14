const express = require('express');
const protect = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');

const router = express.Router();

// POST /api/workouts/log  — save a completed workout session
router.post('/log', protect, async (req, res) => {
  try {
    const { workoutId, workoutName, category, difficulty, durationSeconds, caloriesBurned } = req.body;
    if (!workoutId || !workoutName || !durationSeconds || caloriesBurned === undefined)
      return res.status(400).json({ message: 'Missing required fields' });

    const log = await WorkoutLog.create({
      user: req.user._id,
      workoutId,
      workoutName,
      category,
      difficulty,
      durationSeconds,
      caloriesBurned
    });

    // Update streak
    const user = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const isToday = lastDate && lastDate.getTime() === today.getTime();
    const isYesterday = lastDate && today - lastDate === 86400000;

    if (!isToday) {
      user.currentStreak = isYesterday ? user.currentStreak + 1 : 1;
      user.lastWorkoutDate = new Date();
      await user.save();
    }

    res.status(201).json({ log, currentStreak: user.currentStreak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/history  — get user's workout history
router.get('/history', protect, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/stats  — weekly calories summary
router.get('/stats', protect, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await WorkoutLog.find({
      user: req.user._id,
      completedAt: { $gte: sevenDaysAgo }
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = days.map((day) => ({ day, calories: 0, workouts: 0 }));

    logs.forEach((log) => {
      const dayIndex = new Date(log.completedAt).getDay();
      weekly[dayIndex].calories += log.caloriesBurned;
      weekly[dayIndex].workouts += 1;
    });

    res.json(weekly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
