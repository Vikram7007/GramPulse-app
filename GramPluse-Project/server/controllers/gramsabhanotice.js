const GramSabha = require("../models/GramSabhaNotice.js");
const Notification = require("../models/Notification.js");

// INSERT NOTICE
const GramSabhaNotices = async (req, res) => {
  try {
    const notice = await GramSabha.create(req.body);

    // 🔔 SAVE PERSISTENT NOTIFICATION
    try {
      const newNotif = new Notification({
        title: 'New Gram Sabha Notice 📢',
        desc: `Notice published: "${notice.message?.substring(0, 50)}..." at ${notice.location}`,
        type: 'meeting',
        recipient: 'all', // For everyone
        originalId: notice._id,
        read: false
      });
      await newNotif.save();

      // 🌐 SOCKET EMIT
      const io = global.io;
      if (io) {
        io.emit('newNotification', newNotif);
        io.emit('newGramSabhaNotice', notice);
      }
    } catch (notifErr) {
      console.error('Notice Notif Error:', notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Notice inserted successfully",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL NOTICES
const getdataGramSabha = async (req, res) => {
  try {
    console.log("fhjh");
    const GramSabhaData = await GramSabha.find().sort({ createdAt: -1 });
       console.log(GramSabhaData);
       

    if (GramSabhaData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notices found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notices fetched successfully",
      data: GramSabhaData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  GramSabhaNotices,
  getdataGramSabha
 
};

