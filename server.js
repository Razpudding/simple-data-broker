/*
* Created by: Laurens (github.com/razpudding)
* After running, test by using postman or httpie( http -v POST :3000 hello=='World')
*/

/*
* Try node-inspector for server side debugging
* Use something like this to render the data on get client-side / https://github.com/caldwell/renderjson
*/

const express = require('express')        //used to create a webserver

//Will need this later for storing secret stuff
//require('dotenv').config()

//This is gonna hold our data for now. Will be moved to a database later
let data = []

//This sets up our webserver using the express package
express()
  .use(express.static('static'))  //Used to serve static files like webpages
  //.use(bodyParser.urlencoded({extended: true})) //parse requests
  .get('/', serveHome)  //serve something when someone goes to the root of our "site"
  .post('/', writeData) //Handle POSTS requests
  .listen(3000)         //Listen for communication on this port

//All this does is show clientside the server is working
function serveHome(req, res){
  data.length ? res.send(data) : res.send("Move along sir, nothing to see here")
}

//This function captures the query in the url and saves it to a local data array
//Any data is accepted as long as an 'id' and 'status' are provided with the request
function writeData(req, res){
  try {
    let input = req.query  //Capture the query in the request
    console.log(req.url.length)
    if (req.headers['content-length'] > 100 || req.url.length > 5000) {throw 'Request too large to process'};
    if (!input.id) {throw 'No request id provided'}
    if (!input.status) {throw 'No status provided in message'}
    //console.log(input)
    input.messageId = data.length
    data.push(input)
    console.log(data)
    res.status(200)
    res.send(data)
  }
  catch(error){
    console.log("Client didn't provde the right arguments for the request", error)
    res.status(406)
    res.send(error)
  }
}