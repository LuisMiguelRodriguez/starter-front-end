// Dependencies
var express    = require('express'),
    exphbs     = require('express-handlebars'),
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
var  PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://heroku_90jn865w:7bjcck95abt834sfdqnh2p9m8m@ds235775.mlab.com:35775/heroku_90jn865w');
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// Set Handlebars as the default templating engine.
app.engine("hbs", exphbs({ defaultLayout: "main", extname:'.hbs' }));
app.set("view engine", "hbs");


// Routes
app.get("/scrape", function(req, res) {

  request("https://jslive.com/", function(err, response, body){
    if (err) throw err;

    var $ = cheerio.load(body);

    console.log('-------Length of Articles-------');

    var articles = [];


    $('article .body').each(function(i, element){

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
    console.log(req.body);

    Article.findByIdAndUpdate(req.body._id, {$set: { read: true}}, function(err, doc ){

      if(err) throw err;
      console.log(doc);

      console.log('------------doc------------')
    })



  console.log(req.body);

});

app.post('/removeArticle',function(req, res){

  Article.findByIdAndUpdate(req.body._id, {$set: { read: false}}, function(err, doc ){

    if(err) throw err;

    console.log(doc);

    res.redirect('/savedArticles');
  });

});

app.get('/savedArticles', function(req, res){

  Article.find({read: true}, function(err, docs){
   console.log(docs);

   res.render('savedArticles' , {articles: docs})

  });

});

app.post('/note', function(req, res){
  console.log(req.body)

  var newNote = {
    note: req.body.text
  };

  Article.update({"_id": req.body._id}, {$push: {notes: newNote}},function (error, docs){
    console.log(docs);
  });

});

// Initiate the listener.
app.listen(PORT, function(){
  console.log('Listening on port: ' + PORT);
});
