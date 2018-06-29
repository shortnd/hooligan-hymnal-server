var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = new mongoose.Schema({
  team: String,
  date: Number,
  time: String,
  location: String,
  address: String
}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
