// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

// Require mongoose
var mongoose = require('mongoose');

// Database configuration
mongoose.connect('mongodb://localhost/scraper');
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function(err) {
  console.log('Database Error:', err);
});

// Require our scrapedDataModel
var ScrapedData = require('./scrapedDataModel');

// Scrape data when app starts
var options = {
  url: 'https://www.bodybuilding.com/fun/whats-new.html',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
  }
};
// make a request for the news section of bodybuilding.com
request(options, function(error, response, html) {
  // load the html body from request into cheerio
  var $ = cheerio.load(html);
  // for each element with a "new-content-block" class
  $('div.new-content-block').each(function(i, element) {
    // save the div and a tag
    var $a = $(this).children('a');
    var $div = $(this).children('div');
    // save the img url of each element
    var imgURL = $a.children('img').attr('src');
    // save the title text
    var title = $div.children('h4').text();
    // save the synopsis text
    var synopsis = $div.children('p').text();

    // if this element had all three components
    if (imgURL && title && synopsis) {
      // save the data in the scrapedData db
      db.scrapedData.update(
        {
          title: title
        },
        {
          $set: {
            imgURL: imgURL,
            synopsis: synopsis
          }
        },
        {
          upsert: true
        },
      function(err, saved) {
        // if there's an error during this query
        if (err) {
          // log the error
          console.log(err);
        } 
        // otherwise, 
        else {
          // log the saved data
          console.log(saved);
        }
      });
    }
  });
});

// Main route (simple Hello World Message)
app.get('/', function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get('/all', function(req, res) {
  // find all results from the scraoedData collection in the db
  db.scrapedData.find({}, function(err, found) {
    // throw any errors to the console
    if (err) {
      console.log(err);
    } 
    // if there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get('/scrape', function(req, res) {
  // this will send a "search complete" message to the browser
  res.send("Scrape Complete");
});

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
