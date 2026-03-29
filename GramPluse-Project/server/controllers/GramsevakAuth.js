// controllers/gramSevakAuthController.js

const GramSevak =require("../models/GramSevakAuth");
const bcrypt =require("bcryptjs");

// POST /api/auth/gramsevak/signup
const signupGramSevak = async (req, res) => {
  const { name, username, password, village } = req.body;
  console.log( req.body);

  try {
    // सर्व फील्ड्स भरले आहेत का?
    if (!name || !username || !password || !village) {
      return res.status(400).json({
        success: false,
        message: 'कृपया सर्व फील्ड्स भरा',
      });
    }

    // युजरनेम आधीपासून आहे का?
    const existingUser = await GramSevak.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'हा युजरनेम आधीपासून वापरात आहे',
      });
    }

    // पासवर्ड हॅश करा (bcrypt वापरून)
    const salt = await bcrypt.genSalt(12); // 12 rounds - strong enough
    const hashedPassword = await bcrypt.hash(password, salt);

    // नवीन ग्रामसेवक तयार करा (हॅश केलेला पासवर्ड साठवा)
    const gramSevak = await GramSevak.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword, // आता सुरक्षित आहे!
      village: village.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'खाते यशस्वीपणे तयार झाले!',
      gramsevak: {
        id: gramSevak._id,
        name: gramSevak.name,
        username: gramSevak.username,
        village: gramSevak.village,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'काहीतरी चुकले, नंतर पुन्हा प्रयत्न करा',
    });
  }
};




// Login function - bcrypt सह (सुरक्षित)
const loginGramSevak = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', req.body);

  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'युजरनेम आणि पासवर्ड टाका',
      });
    }

    // युजर शोधा आणि password field select करा (कारण schema मध्ये select: false असू शकते)
    const gramSevak = await GramSevak.findOne({ 
      username: username.toLowerCase() 
    }).select('+password');  // ← महत्वाचे: +password ने password field येईल

    console.log('Found user:', gramSevak);

    if (!gramSevak) {
      return res.status(401).json({
        success: false,
        message: 'चुकीचा युजरनेम किंवा पासवर्ड',
      });
    }

    // bcrypt ने password तपासा
    const isPasswordCorrect = await bcrypt.compare(password, gramSevak.password);

    if (!isPasswordCorrect) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'चुकीचा युजरनेम किंवा पासवर्ड',
      });
    }

    // यशस्वी लॉगिन
    res.json({
      success: true,
      message: 'लॉगिन यशस्वी!',
      gramsevak: {
        id: gramSevak._id,
        name: gramSevak.name,
        username: gramSevak.username,
        village: gramSevak.village,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'सर्व्हर त्रुटी',
    });
  }
};


module.exports= {signupGramSevak,loginGramSevak};
