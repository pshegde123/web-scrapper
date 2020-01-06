var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Require all models
//var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    extname:'.handlebars'
  })
);
app.set('views','./views');
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articles";

mongoose.connect(MONGODB_URI,{ useNewUrlParser: true });

//Routes
require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
 });
  

module.exports = app;