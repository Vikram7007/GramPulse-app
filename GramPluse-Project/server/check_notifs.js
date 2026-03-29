const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Notification = require('./models/Notification');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const urgentNotifs = await Notification.find({ type: 'urgent' }).sort({ createdAt: -1 }).limit(10);
    console.log('--- URGENT NOTIFICATIONS ---');
    console.log(JSON.stringify(urgentNotifs, null, 2));

    const total = await Notification.countDocuments({});
    console.log('\nTOTAL NOTIFICATIONS IN DB:', total);
    
    const sample = await Notification.find({}).sort({ createdAt: -1 }).limit(5);
    console.log('\n--- LATEST 5 NOTIFICATIONS ---');
    console.log(JSON.stringify(sample, null, 2));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Check Error:', err);
  }
}
check();
