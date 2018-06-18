const express = require('express')
const moment = require('moment')
const jsonfile = require('jsonfile')
const Json2csvParser = require('json2csv').Parser;

const router = express.Router();

const DataPoint = require('./models/dataPoint')

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

router.get('/', async (req, res) => {
  res.send('API here!');
  
  const data = await DataPoint.find({});
});

router.get('/months', async (req, res) => {
  const { year } = req.query
  
  if (!year) {
    res.status(422);
    res.send("Missing parameter 'year'");
  }

  const startDate = new Date(year, 0, 2);

  const endDate = new Date(new Date().setFullYear(new Date(startDate).getFullYear() + 1))

  const data = await DataPoint.find({
    date: {
        $gte: startDate,
        $lt: endDate
    }
  })

  const groups = data
  //Sort data by month
  .reduce((collection, dataPoint) => {
    const date = new Date(dataPoint.date)
    const m = date.getMonth()
    const monthName = moment(m + 1, 'M').format('MMMM')

    const month = collection.find(month => month.name === monthName);

    month ? month.data.push(dataPoint) : collection.push({ name: monthName, data: [dataPoint]})

    return collection;
  }, [])
  //Get start and enddate of the month
  .map(month => {
    const monthNumber = months.indexOf(month.name)

    const startDate = new Date(year, monthNumber, 1)
    const endDate = new Date(year, monthNumber + 1, 1)

    month.startDate = startDate
    month.endDate = endDate

    return month
  })
  //Sort months in the right order
  .sort((a, b) => {
    return months.indexOf(a.name) - months.indexOf(b.name);
  })
  //Calculate the amount of weeks per month
  .map(month => {
    //Sort data by week
    const weeks = month.data.reduce((collection, dataPoint) => {
      const w = Math.ceil((new Date(dataPoint.date).getDate()) / 7);

      collection[w] ? collection[w].data.push(dataPoint) : collection[w] = { name: w, data: [dataPoint]};

      return collection;
    }, {})

    for (key in weeks) {
      weeks[key].startDate = weeks[key].data[0].date
      weeks[key].endDate = weeks[key].data[weeks[key].data.length - 1].date
    }

    month.weeks = weeks

    return month
  })
  //Remove all datapoints because they don't have to be sent to the client
  .map(month => {
    //Remove unused data
    delete month.data;

    for (var key in month.weeks) {
      delete month.weeks[key].data;
    }

    return month
  })

  res.send(groups)
});

router.get('/dump', async (req, res) => {
  const { startdate, enddate } = req.query

  const startDate = new Date(startdate.replace(' ', '+'))
  
  const endDate = new Date(enddate.replace(' ', '+'))

  const data = await DataPoint.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  })

  console.log(DataPoint.schema);
  
  var mkdirp = require('mkdirp');
  
  const dirName = './data'
  const fileName = `data_${data[0].date}_${data[data.length - 1].date}.csv`
    
  mkdirp(dirName, function (err) {
    if (err) console.error(err)

    else {
      const parser = new Json2csvParser({
        fields: [ ...Object.keys(DataPoint.schema.obj) ],
      })

      const csv = parser.parse(data)

      if (err) {
        console.log(err);
      }

      res.set({
        'Content-Disposition': `attachment; filename=${fileName}`,
        'Content-Type': 'text/csv'
      })

      res.send(csv);
    }
  });
})

router.get('/delete', async (req, res) => {
  const { startdate, enddate } = req.query

  const startDate = new Date(startdate.replace(' ', '+'))
  
  const endDate = new Date(enddate.replace(' ', '+'))

  res.send(await DataPoint.remove({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }))
})

module.exports = router;