const mongoose = require('mongoose');
const DataPointSchema = mongoose.Schema({
  deviceId: {
    type: String
  },
  status: {
    type: Number
  },
  deviceInfo: {
    type: Array
  }
});

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);