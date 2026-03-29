const mongoose =require('mongoose');

const GramSabhaNoticeSchema = new mongoose.Schema(
  {
    date: {
      type: String,   // '2025-12-10'
      required: true,
    },
    time: {
      type: String,   // '08:24'
      required: true,
    },
    location: {
      type: String,   // ग्रामपंचायत कार्यालय, मुख्य चौकात
      required: true,
      trim: true,
    },
    agenda: {
      type: String,   // road
      required: true,
      trim: true,
    },
    message: {
      type: String,   // notice message (Marathi text)
      required: true,
      trim: true,
    },
    postedDate: {
      type: Date,
      default: Date.now, // auto set if not passed
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);


module.exports=mongoose.model('GramSabha', GramSabhaNoticeSchema)