const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdSchema = new Schema({
  company: {
    type: String,
    required: true
  },
  logo: String,
  picture: String,
  topic: String,
  text: String,
  link: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  types: [{
    type: String,
    default: []
  }]
});

const Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;
