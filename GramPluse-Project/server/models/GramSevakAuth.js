// models/GramSevak.js
const mongoose=require("mongoose");

const gramSevakSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'पूर्ण नाव आवश्यक आहे'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'युजरनेम आवश्यक आहे'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'पासवर्ड आवश्यक आहे'],
  },
  village: {
    type: String,
    required: [true, 'गावाचे नाव आवश्यक आहे'],
    trim: true,
  },
  role: {
    type: String,
    default: 'gramsevak',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GramSevak = mongoose.model('GramSevak', gramSevakSchema);

module.exports=GramSevak;