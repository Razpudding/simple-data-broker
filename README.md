# simple-data-broker
This Node server is a simple data broker which accepts POST requests and stores data in a database. It was designed to catch information sent by IOT devices.

## Usage
1. Set up a mongodb, provide its MongoDB URI in a .env file
2. Run `npm install` in the cloned repo
3. Run the server using `npm start`
3. Test if it runs correctly by sending a correct POST message (see below)

## Features

### Saving data
If data is sent to the server in the correct format at the port defined in the code (3000 by standard) it will be stored in the MongoDB specified in the .env file.

The server expects POST requests with the following urlencoded body parameters

*meetsysteemId* __String__ REQUIRED
*status* __Number__ REQUIRED
*meetdata* __STRING__ REQUIRED

The resulting POST request could look something like this
```
POST / HTTP/1.1
Host: 111.222.333.4:3000
Content-Type: application/x-www-form-urlencoded
Cache-Control: no-cache

meetsysteemId=myDevice&status=42&meetdata=someText
```

`meetdata` Is meant to contain a long string of information sent by the device.

If the request is formatted correctly, the data will be stored in the database and a status of 200 is sent back to the client as well as the amount of saved data objects.
If the request does not follow this format the server will send back a 406 status along with some helpful info.

### Showing stored data
If a GET request is sent to the root of the server, JSON data will be sent back showing the last 100 or so datapoints stored in the database. This is purely for testing purposes.