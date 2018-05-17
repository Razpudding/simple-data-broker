/*
* Created by: Laurens (github.com/razpudding)
*/

/*
* Try node-inspector for server side debugging
*/

const express = require('express')        //used to create a webserver
const bodyParser = require('body-parser') //used for parsing requests for data

//Will need this later for storing secret stuff
//require('dotenv').config()

//This is gonna hold our data for now. Will be moved to a database later
let data = [
  {
  },
]

//This sets up our webserver using the express package
express()
  .use(express.static('static'))  //Used to serve static files like webpages
  //.use(bodyParser.urlencoded({extended: true})) //parse requests
  .get('/', serveHome)  //serve something when someone goes to the root of our "site"
  .post('/', writeData) //Handle POSTS requests
  .listen(3000)         //Listen for communication on this port

//All this does is show clientside the server is working
function serveHome(req, res){
  res.send("Move along sir, nothing to see here")
}

//This function captures the query in the url and saves it to a local data array
function writeData(req, res){
  let input = req.query  //Capture the query in the request
  console.log(input)
  input.id = data.length
  data.push(input)
  console.log(data)
  res.status(200)
  res.send()
}

