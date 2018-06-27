var mongoose = require('mongoose');
var songSchema = require('./songSchema');

module.exports = new mongoose.Schema({
  sender: String,
  send_time: String,
  expire_time: String,
  sender_latitude: String,
  sender_longitude: String,
  message: String,
  push: Boolean,
  song: songSchema
},{
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
