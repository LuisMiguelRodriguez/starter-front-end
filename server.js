// Dependencies
var express    = require("express"),
    exphbs     = require("express-handlebars"),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser'),

    //Our Scraping tools
    cheerio    = require('cheerio'),
    request    = require('request');


// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");


// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Create an instance of the express app.
var app = express();

// Specify the port.
var port = 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongoscraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




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
app.get("/scrape", function(req, res) {

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
    $('article .body').each(function(i, element){

        // console.log($(this).children('h1').text());
        // console.log($(this).children('h1').find("a").attr('href'));
        // console.log($(this).children('p').text());
        // console.log('##############################');
      var title       = $(this).children('h1').text();
      var link        = $(this).children('h1').find("a").attr('href');
      var description = $(this).children('p').text();

      var x = {
        title: title,
        link: link,
        description: description
      };


      var article = new Article(x);

      article.save(function(err, doc){
        if (err){
          console.log (err);
        } else {

        console.log(doc._id);
        x._id = doc._id;

        articles.push(x);

        }

      });

    });

    console.log("----------------------------");
    console.log(articles);

      res.render("index" , {articles: articles});
  });

});

app.get('/', function(req, res){
  res.render('index');

});


app.post('/update', function(req, res){

    Article.findByIdAndUpdate(req.body._id, {$set: { read: true}}, function(err, doc ){

      if(err) throw err;
      console.log(doc);

      console.log('------------doc------------')
    })



  console.log(req.body);

});

app.get('/savedArticles', function(req, res){

  Article.find({read: true}, function(err, docs){
   console.log(docs);

   res.render('savedArticles' , {articles: docs})

  });

});

app.post('/removeArticle',function(req, res){

  Article.findByIdAndUpdate(req.body._id, {$set: { read: false}}, function(err, doc ){

    if(err) throw err;

    console.log(doc);

    res.redirect('/savedArticles');
  })

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
