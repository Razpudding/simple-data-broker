const express = require('express');
const moment = require('moment');

const router = express.Router();

const DataPoint = require('./models/dataPoint')

router.get('/', async (req, res) => {
  res.send('API here!');
  
  const data = await DataPoint.find({});
});

router.get('/months', async (req, res) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const { year } = req.query
  
  if (!year) {
    res.status(422);
    res.send("Missing parameter 'year'");
  }

  const startDate = new Date(year, 0, 1);

  const endDate = new Date(startDate.getFullYear() + 1, 0, 1)

  const data = await DataPoint.find({
    date: {
        $gte: startDate,
        $lt: endDate
    }
  })

  const groups = data.reduce((collection, dataPoint) => {
    const date = new Date(dataPoint.date)
    const m = date.getMonth()
    const monthName = moment(m + 1, 'M').format('MMMM')

    const month = collection.find(month => month.name === monthName);

    month ? month.data.push(dataPoint) : collection.push({ name: monthName, data: [dataPoint]})

    return collection;
  }, [])
  .sort((a, b) => {
    return months.indexOf(a.name) - months.indexOf(b.name);
  })
  .map(month => {
    const weeks = month.data.reduce((collection, dataPoint) => {
      const w = Math.floor(new Date(dataPoint.date).getDate() / 7) + 1;

      collection[w] ? collection[w].data.push(dataPoint) : collection[w] = { name: w, data: [dataPoint]};

      return collection;
    }, {})

    month.weeks = weeks

    return month
  })

  res.send(groups)
});

module.exports = router;