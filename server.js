/*
* Created by: Laurens (github.com/razpudding)
* After running, test by using postman or httpie( http -v POST :3000 hello=='World')
*/

/*
* Try node-inspector for server side debugging
* Use something like this to render the data on get client-side / https://github.com/caldwell/renderjson
*/

const express = require('express')        //used to create a webserver
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')
const generateMockData = require('./generateMockData')

//Api module
const api = require('./api')

require('dotenv').config()   //Secret info
mongoose.Promise = global.Promise //Use the built in ES6 Promise

//Connect to the database as per url provided in the .env file
mongoose.connect(process.env.MONGO_DB_URL)
//Store the connection to the db so we can reference it
const db = mongoose.connection
let dbConnected = false
// Import all data models
const DataPoint = require('./models/dataPoint')

//This is gonna hold our data for now. Will be moved to a database later
let data = []

//This sets up our webserver using the express package
const app = express()
app.use(cors())

app.use(express.static('front-end/dist'))  //Used to serve static files like webpages

app.use(bodyParser.urlencoded({extended: true})) //parse requests

//Routes
app.post('/', writeData) //Handle POSTS requests
app.use('/api', api);

//This function captures the query in the url and saves it to a mongodb
//Any data is accepted as long as a 'deviceId' and 'status' are provided with the request
function writeData(req, res){
  console.log(req.body);
  try {
    let input = req.body  //Capture the query in the request
    console.log(req.body)

    if (!req.body.meetdata) req.body.meetdata = generateMockData();

    console.log(req.body);

    //Turned the next limit off for testing purposes TODO: turn it on again to reasonable limit
    //if (req.headers['content-length'] > 100 || req.url.length > 5000) {throw 'Request too large to process'};
    if (!input.meetsysteemId) {throw 'No device id provided'}
    if (!input.status) {throw 'No status provided in message'}
    if (isNaN(Number(input.status))) {throw 'Provided status is not a number'}
    if (!input.meetdata) {throw 'No data provided in message'}


    const dataPoints = input.meetdata.split(';').map(dp => {
      //console.log(dp)

      const dateString = dp.substr(0, 6);
      const date = moment(dateString, "DDMMYY").format();

      return {
        deviceId: input.meetsysteemId,
        date: new Date(date),
        status: input.status,
        metrics: dp
      }
    })

    console.log(dataPoints)

    DataPoint.insertMany(dataPoints, function(error, docs) {
      if (error) {
        console.error('Insert into db failed', err);
      }
      else {
        res.status(200)
        res.send(docs.length + " docs succesfully inserted into db")
      }
    });
  }
  catch(e){
    console.log("Client didn't provde the right arguments for the request", e)
    res.status(406)
    res.send(e)
  }
}

db.once('open', function() {
  dbConnected = true
})

app.listen(3000) //Listen for communication on this port