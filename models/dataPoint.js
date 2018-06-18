const mongoose = require('mongoose');

const DataPointSchema = mongoose.Schema({
  deviceId: {
    type: String
  },
  date: {
    type: Date
  },
  status: {
    type: Number
  },
  metrics: {
    type: String
  }
});

const DataPoint = module.exports = mongoose.model('DataPoint', DataPointSchema);