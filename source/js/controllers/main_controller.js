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
    if (hospitalIdsStr) {
      var ids = _.map(hospitalIdsStr.split('/'), function(strId) {
        return parseInt(strId, 10);
      });
      this.compareController = new app.Controllers.CompareController(ids);
    } else {
      this.compareController = new app.Controllers.CompareController();
    }
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
