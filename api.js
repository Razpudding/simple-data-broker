const express = require('express');
const moment = require('moment');

const router = express.Router();

const DataPoint = require('./models/dataPoint')

router.get('/', async (req, res) => {
  res.send('API here!');
  
  const data = await DataPoint.find({});
});

router.get('/months', async (req, res) => {
  const data = await DataPoint.find({});

  const groups = data.reduce((collection, dataPoint) => {
    const date = new Date(dataPoint.date)
    const m = date.getMonth()
    const monthName = moment(m, 'M').format('MMMM')

    const month = collection.find(month => month.name === monthName);

    month ? month.data.push(dataPoint) : collection.push({ name: monthName, data: [dataPoint]})

    return collection;
  }, [])

  res.send(groups)
});

module.exports = router;