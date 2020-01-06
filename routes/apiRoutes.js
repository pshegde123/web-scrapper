var mongoose = require("mongoose");

// Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MarketNews", { useNewUrlParser: true });

module.exports = function (app) {
    app.get("/scrape", function (err, res) {
        // First, we grab the body of the html with axios
        axios.get("http://www.cnbc.com/world-markets/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            $("div.Card-titleContainer").each(function (i, element) {
                var result = {};
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
                //console.log("headline = ",result.headline);
                //console.log("link = ",result.link);
                db.Article.create(result).then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                }).catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            });
        });
            // Send a message to the client
        res.send("Scrape Complete");
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });

};