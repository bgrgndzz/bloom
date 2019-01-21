const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  path: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;