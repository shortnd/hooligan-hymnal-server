var mongoose = require('mongoose');
var matchSchema = require('./schemas/matchSchema');

module.exports = mongoose.model('match', matchSchema);
