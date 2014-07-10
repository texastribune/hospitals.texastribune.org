app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.searchView = new app.Views.Search();
    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });

    $('#explorer-introduction').show();
    this.listenTo(this.searchView, 'show', this.verticalAlign);
    this.listenTo(this.searchController, 'after:search', this.showSelect);
    app.searchRegion.show(this.searchView);
    $('#results').html('');
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
    var $disclaimer = $('#disclaimer-box'),
        documentHeight = $(document).height(),
        mastheadHeight = $('.masthead').outerHeight(true),
        containerHeight = $('#main-container').outerHeight(true),
        disclaimerHeight = $disclaimer.outerHeight(true),
        footerHeight = $('footer.footer').outerHeight(true),
        bannerHeight = $('.banner').outerHeight(true),
        disclaimerMarginTop;

    disclaimerMarginTop = documentHeight -
                          bannerHeight -
                          mastheadHeight -
                          containerHeight -
                          disclaimerHeight -
                          footerHeight;

    $('#disclaimer-box').css('margin-top', disclaimerMarginTop);
  }
});
