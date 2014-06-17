'use strict';

app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.searchView = new app.Views.Search();
    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });

    this.listenTo(this.searchView, 'show', this.verticalAlign);
    app.searchRegion.show(this.searchView);
  },

  verticalAlign: function() {
    console.log('fff')
    var documentHeight = $(document).height(),
        $footer = $('footer.footer'),
        footerNoteMarginTop;


    footerNoteMarginTop = documentHeight
                        - $footer.position().top
                        - $footer.height()
                        - parseInt($footer.css('marginTop'), 10);

    $('.footer-note').css('margin-top', footerNoteMarginTop);
  }
});
