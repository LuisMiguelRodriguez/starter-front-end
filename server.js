// Dependencies
var express    = require("express"),
    exphbs     = require("express-handlebars"),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser'),
    cheerio    = require('cheerio'),
    request    = require('request');

// Create an instance of the express app.
var app = express();

// Specify the port.
var port = 3000;

// Set Handlebars as the default templating engine.
app.engine("hbs", exphbs({ defaultLayout: "main", extname:'.hbs' }));
app.set("view engine", "hbs");

// Data
var lunches = [
  {
    lunch: "Beet & Goat Cheese Salad with minestrone soup."
  }, {
    lunch: "Pizza, two double veggie burgers, fries with a big glup"
  }
];

// Routes
app.get("/", function(req, res) {

  request("https://jslive.com/", function(err, response, body){
    if (err) throw err;

    var $ = cheerio.load(body);

    console.log('-------Length of Articles-------');

    var articles = [];

    // var length = $('#articles ')
    // .find('.col-md-18')
    // .each(function(i, element){
    //   console.log($(this).children("h3").text());
    //   console.log($(this).children("a").attr("href"));
    //   console.log($(this).html());
    //   console.log('#########################');
    // })

    // console.log(articles.length);

    // console.log(length);

    // console.log(body);
    var length = $('article .body').each(function(i, element){

      console.log($(this).children('h1').text());
      console.log($(this).children('h1').find("a").attr('href'));
      console.log($(this).children('p').text());

      console.log('##############################');
    });

    // console.log( length);
  })
  res.render("index");
});

// app.get("/weekend", function(req, res) {
//   res.render("index", lunches[1]);
// });
//
// app.get("/lunches", function(req, res) {
//   res.render("all-lunches", {
//     foods: lunches,
//     eater: "david"
//   });
// });

// Initiate the listener.
app.listen(port);
