const express = require('express');
const protect = require('../middleware/auth');
const User = require('../models/User');
const WorkoutLog = require('../models/WorkoutLog');

const router = express.Router();

// GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id });
    const totalCalories = logs.reduce((sum, l) => sum + l.caloriesBurned, 0);

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      age: req.user.age,
      height: req.user.height,
      currentWeight: req.user.currentWeight,
      targetWeight: req.user.targetWeight,
      fitnessGoal: req.user.fitnessGoal,
      currentStreak: req.user.currentStreak,
      joinDate: req.user.createdAt,
      totalWorkouts: logs.length,
      totalCalories
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile/me
router.put('/me', protect, async (req, res) => {
  try {
    const allowed = ['name', 'age', 'height', 'currentWeight', 'targetWeight', 'fitnessGoal'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
