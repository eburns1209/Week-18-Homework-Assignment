// Initialize Express app
var express = require('express');
var path = require('path');
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));

// Set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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
    // save the article url
    var articleURL = $a.attr('href');
    // save the img url of each element
    var imgURL = $a.children('img').attr('src');
    // save the title text
    var title = $div.children('h4').text();
    // save the synopsis text
    var synopsis = $div.children('p').text();
    // create mongoose model
    var scrapedData = new ScrapedData({
      title: title,
      imgURL: imgURL,
      synopsis: synopsis,
      articleURL: articleURL
    });
    // save data
    scrapedData.save(function(err) {
      if (err) {
        //console.log(err);
      } else {
        //console.log('Saved');
      }
    })
  });
});

app.use(express.static('public'));

// Main route send main page
app.get('/', function(req, res) {
  ScrapedData
    .find()
    .sort({_id: 1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      // If successful render first data
      res.render('index', {
        imgURL: data[0].imgURL,
        title: data[0].title,
        synopsis: data[0].synopsis,
        _id: data[0]._id
      });
    })
});

// Retrieve next data from the db
app.get('/next/:id', function(req, res) {
  ScrapedData
    .find({
      _id: {$gt: req.params.id}
    })
    .sort({_id: 1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

// Retrieve prev data from the db
app.get('/prev/:id', function(req, res) {
  ScrapedData
    .find({
      _id: {$lt: req.params.id}
    })
    .sort({_id: -1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
