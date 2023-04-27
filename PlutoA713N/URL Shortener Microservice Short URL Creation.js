require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const body = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//To Generate a random 3 digits id
const idGenerator = ()  => {
  return (Math.trunc((Math.random() * 900) + 100))
}

// To store the Data, UrlKey & Url
const data = new Map();
var key;

// middleware function
// To parse URLs 
app.use(body.urlencoded({extended: false}));

// Using a dns, we will validate a URL
const is_Valid_Url = (req,res,next)=> {
  const url = req.body.url;
  const host = new URL(url).hostname;
  dns.lookup(host, (err, address)=> {
    if(err || !address){
      res.json({error: 'invalid url'});
      return;
    }else{
      next();
    }
  })
}

app.post('/api/shorturl', is_Valid_Url, (req,res) => {
  key = idGenerator();
  req.body.short_url = key;
  data.set(req.body.short_url, req.body.url);
  res.json({  "original_url":req.body.url,
"short-url":req.body.short_url})
});


app.get('/api/shorturl/:short_url',  (req,res) => { 
  req.params.short_url = key;
  var prop = req.params.short_url; 
res.redirect(data.get(prop));
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
