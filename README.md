# Web Scrapper
![](./public/assets/images/frontPage.PNG)

### Overview
This is a web app that lets users view and write notes on the latest stock market news from Marketwatch.com.

(1) __Scrape__ : _Scrape New Articles_ button when clicked scrapes latest articles from https://www.marketwatch.com/ site and save the article details in MongoDB collection called 'articles'.

(2) __Clear__: _Clear_ button when clickrd removes all the articles loaded in the database.

(3) __Saved Articles__: _Saved Articles_ link loads a page with a list of articles marked as 'Save' by the user. 

(4)__Notes__: For each saved article user can writes notes by clicking 'Article Notes' button. These notes are saved in database collection called 'notes'.

### Technologies Used
* For Front-end : Bootstrap , handlebars template 
* For back-end : Node , Express
* For Database : MongoDB , mongoose.js for schema validation

