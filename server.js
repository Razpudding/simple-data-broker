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
express()
  .use(express.static('static'))  //Used to serve static files like webpages
  .use(bodyParser.urlencoded({extended: true})) //parse requests
  .get('/', serveHome)  //serve something when someone goes to the root of our "site"
  .post('/', writeData) //Handle POSTS requests
  .listen(3000)         //Listen for communication on this port

//All this does is show clientside the server is working
function serveHome(req, res){
  if(dbConnected){
    //Find the last 10 items (sorted by date stored) while surpressing some unecessary data keys
    DataPoint.find({}, { _id: 0, apiKey: 0, __v: 0 }).sort({_id:-1}).limit(10)  
      .then(results => {
        //console.log(results)
        res.send(results.length < 1? "Move along sir, nothing to see here" : results)
      })
  } else {
    res.status(503)
    res.send("Database not available (yet)")
  }
}

//This function captures the query in the url and saves it to a mongodb
//Any data is accepted as long as a 'deviceId' and 'status' are provided with the request
function writeData(req, res){
  try {
    let input = req.body  //Capture the query in the request
    console.log(req.body)

    //Turned the next limit off for testing purposes
    //if (req.headers['content-length'] > 100 || req.url.length > 5000) {throw 'Request too large to process'};
    if (!input.meetsysteemId) {throw 'No device id provided'}
    if (!input.status) {throw 'No status provided in message'}
    if (isNaN(Number(input.status))) {throw 'Provided status is not a number'}
    if (!input.meetdata) {throw 'No data provided in message'}
    //let dataPointAmount = input.meetdata.split(';').length
    //console.log(dataPointAmount)

    let dataPoints = input.meetdata.split(';').map(dp => {
      //console.log(dp)
      return {
        deviceId: input.meetsysteemId,
        date: new Date(),
        status: input.status,
        metrics: dp
      }
    })
    console.log(dataPoints)

    DataPoint.insertMany(dataPoints, function(error, docs) {
      console.log(docs)
    });
    //data.push(input)
    // const dataPoint = new DataPoint(input)
    // dataPoint.deviceInfo.push(input['pvPhase1'])
    // dataPoint
    //   .save()
    //   .then(newDataPoint => console.log("new data:", newDataPoint))
    //   .catch(err => { throw Error(err) })
      
    res.status(200)
    res.send()
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

