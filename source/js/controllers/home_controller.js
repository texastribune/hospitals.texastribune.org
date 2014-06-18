'use strict';

app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.searchView = new app.Views.Search();
    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });

    this.listenTo(this.searchView, 'show', this.verticalAlign);
    this.listenTo(this.searchController, 'after:search', this.showSelect);
    app.searchRegion.show(this.searchView);
  },

  showSelect: function() {
    var hospitalsCollection = this.searchController.collection;

    if (hospitalsCollection.length === 0) {
      this.searchView.showEmpty();
    } else {
      this.selectController = new app.Controllers.SelectController({
        hospitals: hospitalsCollection,
        searching: this.searchController.searching
      });
      this.searchController.close();
    }
  },

  verticalAlign: function() {
    var documentHeight = $(document).height(),
        $footer = $('footer.footer'),
        footerNoteMarginTop;


    footerNoteMarginTop = documentHeight -
                          $footer.position().top -
                          $footer.height() -
                          parseInt($footer.css('marginTop'), 10);

    $('.footer-note').css('margin-top', footerNoteMarginTop);
  }
});
