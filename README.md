# simple-data-broker
This Node server is a simple data broker which accepts POST requests and stores data in a database.

## Usage
1. Set up a mongodb, provide its MongoDB URI in a .env file
2. Run the server using `npm start`
3. Test if it runs correctly by sending a correct POST message (see below)

## Features

The server accepts two requests:

1.`POST /` If a message is posted to the root of the server following this format: {id:Number, status:Number, [additional optional params]} the server will store the message in a database table as is. Both the `id` and the `status` are required. The request should be a valid POST request with all data values provided as query parameters. After testing I found out the following content types will work (application/x-www-form-urlencoded, multipart/form-data, no content-type provided) although i'm not 100% sure on that last one.
2. `GET /` If the root of the server is requested, all available data is dumped back to the requester. Note: I have no idea how stable that is or how long the data is allowed to be for this to work. This is purely a test feature and should prob be protected.