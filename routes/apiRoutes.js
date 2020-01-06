var mongoose = require("mongoose");

// Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MarketNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {

    app.get("/", function (err, response) {
        db.Article.find({ saved: false }, function (err, data) {
            response.render('index', { home: true, article: data })
        });
    });

    /* Clear saved articles from database*/
    app.get("/clear", function (err, res) {
        db.Article.remove({}, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        });
    });

    /*Route to scrape latest articles */
    app.get("/scrape", function (err, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.marketwatch.com/markets?mod=top_nav").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            $("div.article__content").each(function (i, element) {
                var result = {};
                result.title = $(this).find(".article__headline").children("a").text();
                result.link = $(this).find(".article__headline").children("a").attr("href");
                result.ticker = $(this).find(".group--tickers").children("a").children("span").text();
                result.tickerLink = $(this).find(".group--tickers").children("a").attr("href");
                result.tickerChange = $(this).find(".group--tickers").children("a").children("bg-quote").text();
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
        res.send("Scrape complete");
    });

    /* Get articles saved in database */
    app.get("/saved", function (err, response) {
        db.Article.find({ saved: true }, function (err, data) {
            response.render('saved', { home: false, article: data });
        });
    });

    // save article to database by changed saved field to true
    app.put("/article/:id", function (req, res) {
        var saved = req.body.saved == 'true'
        if (saved) {
            db.Article.updateOne({ _id: req.body._id }, { $set: { saved: true } }, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    return res.send(true)
                }
            });
        }
    });

    // delete article from database
    app.delete("/article/:id", function (req, res) {
        db.Article.deleteOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    });

    // get back all notes for a given article
    app.get("/notes/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                console.log("dbArticle.note=",dbArticle.note);
                res.json(dbArticle.note)
            })
            .catch(function (err) {
                res.json(err)
            })
    });

    // add note to an article
    app.post("/notes", function (req, res) {
        db.Note.create({ noteText: req.body.noteText })
            .then(function (dbNote) {
                console.log('dbNote:' + dbNote)
                return db.Article.findOneAndUpdate({ _id: req.body._headlineId },
                    { $push: { note: dbNote._id } },
                    { new: true })
            })
            .then(function (dbArticle) {
                console.log('dbArticle:' + dbArticle)
                res.json(dbArticle)
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // delete note form article
    app.delete("/notes/:id", function (req, res) {
        db.Note.deleteOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });

};