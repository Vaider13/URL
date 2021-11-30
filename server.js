require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dns = require("dns");
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });;

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

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


let urlSchema = new Schema({
  url: String,
  shorturl: String
});

let Short = mongoose.model("Short", urlSchema);

let createShortUrl = (urll, sturl) => {
  let shortUrl = new Short ({ url: urll, shorturl: sturl });
  console.log(shortUrl);
  shortUrl.save((err, data) => {
  if (err) return console.error(err);
  })
};

function isValidWebUrl(url) {
   let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
   return regEx.test(url);
}
//5vz6498dcac eurin72sp
app.post("/api/shorturl/", (req, res) => {
  let urlString = req.body.url;
  if(isValidWebUrl(urlString) === false) {
    res.json({error: "invalid URL"});
  } else {
    let generateId = Math.random().toString(36).substr(2, 18); 
      createShortUrl(urlString, generateId);
      res.json({original_url: urlString, short_url: generateId}); 
    }
  }); 

app.get("/api/shorturl/:short_url?", (req, res) => {
  Short.findOne({shorturl: req.params.short_url},"url", (err, data) => {
      if (err) console.log(err);
      if (data === null) {
        res.json({error: "Invalid URL"})
      } else {
        res.redirect(data.url);
      }
  })
})