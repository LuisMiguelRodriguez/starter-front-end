// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");

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
