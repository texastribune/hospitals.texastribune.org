'use strict';

app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.searchView = new app.Views.Search();
    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });

    this.listenTo(this.searchView, 'show', this.verticalAlign);
    this.listenTo(this.searchController, 'after:search', this.showSelect);
    $(window).on('resize', this.verticalAlign);
    app.searchRegion.show(this.searchView);
  },

  onClose: function() {
    $(window).off('resize', this.verticalAlign);
  },

  showSelect: function() {
    var hospitalsCollection = this.searchController.collection;

    if (hospitalsCollection.length === 0) {
      this.searchView.showEmpty();
    } else {
      this.selectController = new app.Controllers.SelectController({
        results: hospitalsCollection,
        searching: this.searchController.searching
      });
      this.searchController.close();
      this.close();
    }
  },

  verticalAlign: function() {
    var documentHeight = $(document).height(),
        $footer = $('footer.footer'),
        footerNoteMarginTop;

    footerNoteMarginTop = documentHeight -
                          $footer.position().top -
                          $footer.height();

    $('.footer-note').css('margin-top', footerNoteMarginTop);
  }
});
