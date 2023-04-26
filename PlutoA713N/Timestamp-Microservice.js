// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require("moment");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// A Function to check validDate()
const isValidDate = (input) => {
  const date =  moment(input, "YYYY-MM-DD", true);
  return date.isValid() && date.format("YYYY-MM-DD") === input;
}

// To get a Utc date in a Specified format
const dateToGmt = (t) => {
  const seconds = t.getTime();
 const output = moment.utc(seconds).format('ddd, DD MMM YYYY ss:ss:ss [GMT]')
  return output;
}


app.get('/api/:date?', (req,res) => {
  
  const input = req.params.date;
  const time = new Date(input);
  
// To Handle if the Route param is Empty or not passed
    if(!input){
    const currentTime = new Date().toString();
    const currentUnix = new Date().getTime();   res.json({"unix":currentUnix,"utc":currentTime})
  }

// If date is InValid(), it returns Error
  else if(!isValidDate(input) && input.includes('-')){
    res.json({error: "Invalid Date"})
  }

    // for  Valid Date
  else if(isValidDate(input)){
    var utcTime = dateToGmt(time)
    var unixSec  = moment.utc(time).valueOf();      res.json({'unix':unixSec,'utc':utcTime})
    
  } 
  else if(!isNaN(input)){
    const utcDate = moment.unix(input/1000).utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"); 
    res.json({"unix": Number(input), "utc": utcDate})
  } else {
    const u = time.getTime();
    const ut = time.toUTCString();
    res.json({"unix":u, "utc":ut})
  }
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
