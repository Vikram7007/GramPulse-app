const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'urgent', 'meeting', 'update', 'success', 'info'
  read: { type: Boolean, default: false },
  recipient: { type: String, default: 'all' }, // 'all' or GramSevak ID/Username
  assignedTo: { type: String }, 
  sender: { type: String, default: 'Village Admin' },
  originalId: { type: mongoose.Schema.Types.ObjectId }, // Link to Issue or Notice
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Notification', notificationSchema);
