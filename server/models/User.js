const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    age: { type: Number, default: null },
    height: { type: Number, default: null }, // cm
    currentWeight: { type: Number, default: null }, // kg
    targetWeight: { type: Number, default: null }, // kg
    fitnessGoal: {
      type: String,
      enum: ['Build Muscle & Lose Fat', 'Weight Loss', 'Muscle Gain', 'Improve Endurance', 'General Fitness'],
      default: 'General Fitness'
    },
    currentStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date, default: null }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Auto-generate avatar initials
userSchema.pre('save', function (next) {
  if (!this.avatar && this.name) {
    const parts = this.name.trim().split(' ');
    this.avatar = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
