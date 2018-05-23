const mongoose = require('mongoose');
const DataPointSchema = mongoose.Schema({
  deviceId: {
    type: String
  },
  date: {
    type: String
  },
  status: {
    type: Number
  },
  metrics: {
    type: String
  }
});

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);