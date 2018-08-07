/*
* Created by: Laurens (github.com/razpudding)
* After running, test by using postman or httpie( http -v POST :3000 hello=='World')
*/

/*
* Try node-inspector for server side debugging
*/

const express = require('express')        //used to create a webserver
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config()   //Secret info
mongoose.Promise = global.Promise //Use the built in ES6 Promise

//Set the right URL and connection options for Mongoose
const mongooseURL = process.env.MONGO_DB_URL
const mongooseOptions = {auto_reconnect: true, reconnectInterval: 10000, connectTimeoutMS: 30000}

//Connect to the database as per url provided in the .env file
//The application will wait for 30s before attempting this to allow the server to boot up mongodb
//I tried doing this through the mongoose options but it doesn't seem to work correctly.
setTimeout(() =>{
  mongoose.connect(mongooseURL, mongooseOptions)
  .then(
    () => {},
    err => console.log(err))}, 30000)
//Store the connection to the db so we can reference it
const db = mongoose.connection
let dbConnected = false
// Import all data models
const DataPoint = require('./models/dataPoint')

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
    DataPoint.find({}, { _id: 0, apiKey: 0, __v: 0 }).sort({_id:-1}).limit(100)  
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
    //console.log(req.body)
    //check if the input is valid
    if (!input.meetsysteemId) {throw 'No device id provided'}
    if (!input.status) {throw 'No status provided in message'}
    if (isNaN(Number(input.status))) {throw 'Provided status is not a number'}
    if (!input.meetdata) {throw 'No data provided in message'}


    let dataPoints = input.meetdata.split(';').map(dp => {
      //console.log(dp)
      return {
        deviceId: input.meetsysteemId,
        date: new Date(),
        status: input.status,
        metrics: dp
      }
    })
    //console.log(dataPoints)

    DataPoint.insertMany(dataPoints, function(error, docs) {
      if (error) {
        console.error('Insert into db failed', error);
      }
      else {
        res.status(200)
        res.send(docs.length + " docs succesfully inserted into db")
      }
    });
  }
  catch(e){
    console.log("Client didn't provide the right arguments for the request", e)
    res.status(406)
    res.send(e)
  }
}

//Some helper functions to detect if anything goes wrong with the db connection
db.once('open', function() {
  dbConnected = true
  console.log('MongoDB connection opened!');
})
db.on('connecting', function() {
  console.log('connecting to MongoDB...');
})
db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error)
   //mongoose.disconnect();
})
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
})
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');  
})