const GramSevakAssignedIssue = require('../models/GramSevakAssignedIssue');
const GramSevakIssue = require('../models/GramSevakIssue');
const Notification = require('../models/Notification');

/**
 * CREATE GramSevakAssignedIssue
 */
exports.createGramSevakAssignedIssue = async (req, res) => {
  try {
    console.log("viki lale", req.body);

    const {
      type,
      description,
      location,
      images,
      votes,
      priority,
      assignedTo,
      status,
      comments,
      proofPhotos,
      originalIssueId
    } = req.body;

    // 🔴 REQUIRED FIELDS CHECK
    if (!type || !description || !assignedTo || !originalIssueId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // ✅ Convert location → GeoJSON
    let geoLocation = {
      type: "Point",
      coordinates: []
    };

    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number"
    ) {
      geoLocation.coordinates = [location.lng, location.lat];
    }

    const newAssignedIssue = new GramSevakAssignedIssue({
      type,
      description,
      location: geoLocation,
      images: Array.isArray(images) ? images : [],
      votes: Array.isArray(votes) ? votes : [],
      priority: priority || null,
      assignedTo,
      status: status || "in-progress",
      comments: Array.isArray(comments)
        ? comments.map(c => ({
            text: c.text,
            date: c.date || new Date().toLocaleDateString("hi-IN"),
            time: c.time || new Date().toLocaleTimeString("hi-IN")
          }))
        : [],
      proofPhotos: Array.isArray(proofPhotos) ? proofPhotos : [],
      originalIssueId
    });

    await newAssignedIssue.save();

    // 🔔 Persistence: Save Task Notification to Database for the specific GramSevak
    try {
      const newNotif = new Notification({
        title: 'New Task Assigned 📋',
        desc: `New duty assigned: "${newAssignedIssue.type}". Priority: ${newAssignedIssue.priority || 'Normal'}. Please review and take action.`,
        type: 'urgent',
        read: false,
        recipient: assignedTo, // Targeted to this specific GramSevak
        originalId: newAssignedIssue._id
      });
      await newNotif.save();

      // 📡 Live: Emit via Socket.io to specific GramSevak
      const io = globalThis.io || global.io;
      if (io) {
        const room = `gramsevak:${assignedTo.trim().toLowerCase()}`;
        io.to(room).emit('newNotification', newNotif);
        console.log("✅ Task Assignment Notif broadcasted to room:", room);
      }
    } catch (notifErr) {
       console.error("❌ Notification Persistence/Live Error:", notifErr);
    }

    // 🔔 Notify ALL (Global Broadcast for safety) - ONLY SOCKET EMIT HERE, NO DB SAVE (to avoid double notifs)
    if (newAssignedIssue.status.toLowerCase() === 'completed' || (status && status.toLowerCase() === 'completed')) {
      const io = globalThis.io || global.io;
      if (io) {
        io.emit('gramsevakTaskUpdate', {
          id: newAssignedIssue._id,
          status: 'Completed',
          title: newAssignedIssue.type,
          assignedTo: newAssignedIssue.assignedTo,
          time: new Date().toLocaleTimeString('hi-IN')
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "GramSevakAssignedIssue created successfully",
      data: newAssignedIssue
    });

  } catch (error) {
    console.error("Create GramSevakAssignedIssue Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating assigned issue"
    });
  }
};


/**
 * UPDATE GramSevakIssue STATUS
 */
exports.GramSevekStatusUpdate = async (req, res) => {
  try {
    const { id, status } = req.params;

    const updated = await GramSevakIssue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    console.log("Updated Issue:", updated);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "GramSevakIssue not found"
      });
    }

    // 🔔 Notify ALL (Global Broadcast for safety) & Persist to DB
    if (updated.status && updated.status.toLowerCase() === 'completed') {
      try {
        const newNotif = new Notification({
          title: 'Issue Resolved',
          desc: `Gramsevak ${updated.assignedTo} marked "${updated.type}" as complete.`,
          type: 'success',
          read: false
        });
        await newNotif.save();
        console.log("✅ Notification saved successfully for updated issue");
      } catch (err) { 
        console.error("Notif Save Error (update):", err); 
      }

      const io = globalThis.io || global.io;
      if (io) {
        io.emit('gramsevakTaskUpdate', {
          id: updated._id,
          status: updated.status,
          title: updated.type,
          assignedTo: updated.assignedTo,
          time: new Date().toLocaleTimeString('hi-IN')
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status"
    });
  }
};


// Get all issues completed by Gram Sevak
exports.GetAllGramsevekCompletedIssue = async (req, res) => {
  try {
    const gramSevakCompletedIssues = await GramSevakAssignedIssue.find({ 
      status: 'Completed' 
    });
    
    return res.status(200).json({
      success: true,
      message: 'Completed issues fetched successfully',
      count: gramSevakCompletedIssues.length,
      data: gramSevakCompletedIssues
    });
  } catch (err) {
    console.error('Error fetching Gram Sevak completed issues:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching completed issues' });
  }
};


/**
 * TEST NOTIFICATION
 */
exports.TestNotification = async (req, res) => {
  try {
    const testNotif = new Notification({
      title: 'Test Alert',
      desc: 'ही एक चाचणी सूचना आहे (This is a test notification)',
      type: 'info',
      read: false
    });
    await testNotif.save();
    res.json({ success: true, message: "Test notification created!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * GET ALL NOTIFICATIONS
 */
exports.GetNotifications = async (req, res) => {
  try {
    const { assignedTo, marathiName } = req.query;
    
    // Fetch notifications where recipient is 'all' OR specifically for this Gram Sevak
    const query = {
      $or: [
        { recipient: 'all' },
        { recipient: assignedTo ? new RegExp(assignedTo.trim(), 'i') : null },
        { recipient: marathiName ? new RegExp(marathiName.trim(), 'i') : null },
        { assignedTo: assignedTo ? new RegExp(assignedTo.trim(), 'i') : null }
      ].filter(item => Object.values(item)[0] !== null)
    };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

/**
 * MARK ALL READ
 */
exports.MarkAllNotificationsAsRead = async (req, res) => {
  try {
    const { assignedTo, marathiName } = req.body;
    const query = {
      read: false,
      $or: [
        { recipient: 'all' },
        { recipient: { $in: [assignedTo, marathiName] } }
      ]
    };
    await Notification.updateMany(query, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error marking read" });
  }
};
