// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Sarpanch = require("../models/Villageauth"); // Model (collection: sarpanch)

// @route   POST /api/auth/villagelogin/sarpanch → सरपंच लॉगिन
const Villagelogin= async (req, res) => {
  const { username, password } = req.body;
console.log(req.body)
  if (!username || !password) {
    return res.status(400).json({ message: "कृपया युजरनेम आणि पासवर्ड टाका" });
  }

  try {
    const user = await Sarpanch.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "अवैध युजरनेम किंवा पासवर्ड" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "अवैध युजरनेम किंवा पासवर्ड" });
    }

    if (user.role !== "village_admin") {
      return res.status(403).json({ message: "फक्त सरपंच/प्रशासक लॉगिन करू शकतात" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        username: user.username,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, name: user.name, mobile: user.username, message: "लॉगिन यशस्वी!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "सर्व्हर त्रुटी" });
  }
};

// @route   POST /api/auth/village/signup → नवीन सरपंच खाते तयार करा
const VillageSignup= async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "सर्व फील्ड्स आवश्यक आहेत" });
  }

  try {
    const existingUser = await Sarpanch.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "हा युजरनेम आधीच वापरला आहे" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Sarpanch({
      name,
      username,
      password: hashedPassword,
      role: "village_admin",
    });

    await newUser.save();

    res.json({ message: "खाते यशस्वीपणे तयार झाले! आता लॉगिन करा." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "खाते तयार करताना त्रुटी" });
  }
};

// @route   PUT /api/auth/village/sarpanch/password
const VillageChangePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "सर्व फील्ड्स आवश्यक आहेत" });
  }

  try {
    const user = await Sarpanch.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "अॅडमिन सापडला नाही!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "सध्याचा पासवर्ड चुकीचा आहे" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "पासवर्ड यशस्वीपणे बदलला!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "सर्व्हर त्रुटी" });
  }
};

module.exports = {VillageSignup,Villagelogin,VillageChangePassword};