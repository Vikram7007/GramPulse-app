// controllers/issueController.js (पूर्ण FINAL updated – 100% safe & stable)

const Issue = require('../models/Issue');
const GramSevakIssue = require('../models/GramSevakIssue');
const Notification = require('../models/Notification');


// Create new issue
exports.createIssue = async (req, res) => {
  const { type, description, location, images } = req.body;
  const submittedBy = req.user;

  if (!type || !description || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return res.status(400).json({ msg: 'प्रकार, वर्णन आणि ठिकाण (lat, lng) आवश्यक आहे' });
  }

  if (images && !Array.isArray(images)) {
    return res.status(400).json({ msg: 'images हे array असावे' });
  }

  try {
    const newIssue = new Issue({
      type: type.trim(),
      description: description.trim(),
      location: { lat: Number(location.lat), lng: Number(location.lng) },
      images: images || [],
      submittedBy,
      status: 'pending'
    });

    const savedIssue = await newIssue.save();
    await savedIssue.populate('submittedBy', 'name mobile village');

    const io = req.app.get('io');
    if (io) io.emit('newIssue', savedIssue);

    res.status(201).json({ success: true, msg: 'समस्या नोंदवली!', issue: savedIssue });
  } catch (err) {
    console.error('Create Issue Error:', err);
    res.status(500).json({ msg: 'समस्या नोंदवताना त्रुटी' });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('submittedBy', 'name mobile village')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: issues.length, issues });
  } catch (err) {
    console.error('Get Issues Error:', err);
    res.status(500).json({ msg: 'समस्यांची यादी मिळवताना त्रुटी' });
  }
};

// Get single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('submittedBy', 'name mobile village');
    
    if (!issue) return res.status(404).json({ msg: 'समस्या सापडली नाही' });

    res.json({ success: true, issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'समस्या माहिती मिळवताना त्रुटी' });
  }
};

// Get logged-in user issues
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ submittedBy: req.user })
      .populate('submittedBy', 'name mobile village')
      .sort({ createdAt: -1 })
      .lean();
      
    res.json({ success: true, count: issues.length, issues });
  } catch (err) {
    console.error('Get My Issues Error:', err);
    res.status(500).json({ msg: 'तुमच्या समस्या मिळवताना त्रुटी' });
  }
};

// Vote on issue
exports.voteIssue = async (req, res) => {
  const userId = req.user;
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'समस्या सापडली नाही' });
    if (issue.votes.includes(userId)) return res.status(400).json({ msg: 'आधीच मत दिले आहे' });

    issue.votes.push(userId);
    await issue.save();
    await issue.populate('submittedBy', 'name mobile village');

    const io = req.app.get('io');
    if (io) io.emit('voteUpdate', issue);

    res.json({ success: true, msg: 'मत नोंदवले!', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'मत देताना त्रुटी' });
  }
};

// Approve Issue
exports.approveIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('submittedBy', 'name mobile village');

    if (!issue) return res.status(404).json({ msg: 'समस्या सापडली नाही' });

    const io = req.app.get('io');
    if (io) io.emit('issueUpdate', issue);

    res.json({ success: true, msg: 'समस्या मंजूर केली!', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'मंजूर करताना त्रुटी' });
  }
};

// Reject Issue
exports.rejectIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', priority: null, assignedTo: null },
      { new: true }
    ).populate('submittedBy', 'name mobile village');

    if (!issue) return res.status(404).json({ msg: 'समस्या सापडली नाही' });

    const io = req.app.get('io');
    if (io) io.emit('issueUpdate', issue);

    res.json({ success: true, msg: 'समस्या नाकारली!', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'नाकारताना त्रुटी' });
  }
};

// controllers/issueController.js – assignToGramSevak (FINAL SAFE VERSION)

exports.assignToGramSevak = async (req, res) => {
  let { priority, assignedTo } = req.body;
  priority = priority ? priority.trim().toLowerCase() : '';
  
  // Translation Key Mapping (Robustness Fix)
  const nameMap = {
    'gramSevakNames.rajeshKumar': 'राजेश कुमार',
    'gramSevakNames.sureshPatil': 'सुरेश पाटील',
    'gramSevakNames.amitSharma': 'अमित शर्मा',
    'gramSevakNames.priyaDevi': 'प्रिया देवी',
    'gramSevakNames.rameshSingh': 'रमेश सिंह'
  };
  
  assignedTo = assignedTo ? assignedTo.trim() : '';
  if (nameMap[assignedTo]) {
    assignedTo = nameMap[assignedTo]; // Use the real name if a key was passed
  }

  if (!priority || !assignedTo) {
    return res.status(400).json({
      success: false,
      msg: 'प्राधान्य आणि ग्रामसेवक नाव आवश्यक आहे'
    });
  }

  try {
    const rawIssue = await Issue.findById(req.params.id);
    if (!rawIssue) {
      return res.status(404).json({
        success: false,
        msg: 'ही समस्या सापडली नाही'
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status: 'in-progress',
        priority: priority.toLowerCase(),
        assignedTo
      },
      { new: true }
    ).populate('submittedBy', 'name mobile village');

    const gramsevakIssue = new GramSevakIssue({
      type: issue.type,
      description: issue.description,
      location: issue.location,
      images: issue.images || [],
      submittedBy: rawIssue.submittedBy,
      votes: issue.votes || [],
      status: 'in-progress',
      priority: priority.toLowerCase(),
      assignedTo,
      originalIssueId: issue._id,
      createdAt: issue.createdAt
    });

    await gramsevakIssue.save();

    // 🔔 SAVE PERSISTENT NOTIFICATION & SOCKET EMIT
    try {
      const newNotif = new Notification({
        title: 'New Task Assigned 📋',
        desc: `Admin assigned: "${issue.type}". Priority: ${priority.toUpperCase()}`,
        type: 'urgent',
        recipient: assignedTo,
        assignedTo: assignedTo,
        originalId: issue._id,
        read: false
      });
      await newNotif.save();

      const io = global.io;
      if (io) {
        const room = `gramsevak:${assignedTo.trim().toLowerCase()}`;
        io.to(room).emit('newNotification', newNotif);
        io.to(room).emit('newGramSevakIssue', gramsevakIssue);
        io.emit('newNotification', newNotif); // Broadcast for safety
        io.emit('issueUpdate', issue);
        console.log("📡 Live Task Notif broadcasted for:", assignedTo);
      }
    } catch (notifErr) {
      console.error('Notification/Socket Error:', notifErr);
    }

    res.json({
      success: true,
      msg: 'समस्या ग्रामसेवकाला सोपवली!',
      issue
    });
  } catch (err) {
    console.error('Assign Error:', err);
    res.status(500).json({
      success: false,
      msg: 'सर्व्हर त्रुटी'
    });
  }
};

// Get all GramSevakIssue data (used for /gramsevek endpoint)
exports.getAllGramSevakIssues = async (req, res) => {
  try {
      console.log("viki lale")
    const issues = await GramSevakIssue.find()
      .populate('submittedBy', 'name mobile village')
      .sort({ createdAt: -1 })
      .lean();
   
     console.log(issues);
     
    const stats = {
      total: issues.length,
      inProgress: issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      totalVotes: issues.reduce((sum, issue) => sum + (issue.votes?.length || 0), 0)
    };

    res.json({
      success: true,
      count: issues.length,
      stats,
      issues
    });
  } catch (err) {
    console.error('Get All GramSevak Issues Error:', err);
    res.status(500).json({
      success: false,
      msg: 'ग्रामसेवकांच्या समस्या मिळवताना त्रुटी'
    });
  }
};



// controllers/gramSevakController.js


