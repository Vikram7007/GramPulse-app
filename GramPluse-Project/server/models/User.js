const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  village: { type: String, required: true },
  role: { type: String, enum: ['villager', 'gramsevak', 'admin'], default: 'villager' },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },
  occupation: { type: String, default: '' },
  skills: { type: [String], default: [] },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1595389134175-e83f20cc161d?w=400&h=400&fit=crop' },
  age: { type: String, default: '' },
  languages: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);