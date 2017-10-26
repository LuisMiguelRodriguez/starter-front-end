// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

var NoteSchema = new Schema({ note: String });

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  },
  notes: [NoteSchema]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
