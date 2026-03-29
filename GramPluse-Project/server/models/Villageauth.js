// models/User.js  (किंवा Villageauth.js)
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // युजरनेम नेहमी lowercase मध्ये सेव्ह होईल
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  role: {
    type: String,
    enum: ["village_admin", "gramsevak", "citizen"],
    default: "village_admin", // तुमच्या सध्याच्या लॉजिकनुसार
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model("sarpanch", UserSchema);