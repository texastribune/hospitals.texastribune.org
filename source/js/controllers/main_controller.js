'use strinct';

app.Controllers.MainController = Marionette.Controller.extend({
  initialize: function() {},

  index: function() {
    this.showSearch();
  },

  search: function(query) {
    this.showSearch();
    this.homeController.search(query);
  },

  compare: function(hospitalIdsStr) {
    // Load CompareController
    this.showCompare(hospitalIdsStr.split('/'));
  },

  showSearch: function() {
    this.homeController = new app.Controllers.SearchController();
    this.listenTo(this.homeController, 'compare:hospitals', this.showCompare);
  },

  showCompare: function(hospitalIds) {
    app.mainRouter.navigate('compare/' + hospitalIds.join('/'));
    this.compareController = new app.Controllers.CompareController(hospitalIds);
  }
});
