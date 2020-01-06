$(document).ready(function () {
  var articleContainer = $(".article-container");
  $(".clear").on("click", handleArticleClear);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(document).on("click", ".btn.save", handleArticleSave);


  function handleArticleClear() {
    $.get('/clear').then(function (data) {
      articleContainer.empty();
      location.reload();
    });
  };
  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/scrape").then(function (data) {
      console.log(data)
      window.location.href = "/";
    });
  }

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    console.log(articleToSave)
    $.ajax({
      method: "PUT",
      url: "/article/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      console.log(data)
      // If the data was saved successfully
      if (data) {
        // Run the initPage function again. This will reload the entire list of articles
        // initPage();
        location.reload();
      }
    });
  }

});