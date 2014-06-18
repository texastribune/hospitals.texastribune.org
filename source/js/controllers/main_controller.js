'use strinct';

app.Controllers.MainController = Marionette.Controller.extend({
  initialize: function() {},

  index: function() {
    this.showSearch();
  },

  search: function(query) {
    this.selectController = new app.Controllers.SelectController({
      searching: query
    });
  },

  compare: function(hospitalIdsStr) {
    // TODO: Solve duplication
    var ids = _.map(hospitalIdsStr.split('/'), function(strId) {
      return parseInt(strId, 10);
    });
    this.compareController = new app.Controllers.CompareController(ids);
  },

  select: function(hospitalIdsStr) {
    if (hospitalIdsStr) {
      var ids = _.map(hospitalIdsStr.split('/'), function(strId) {
        return parseInt(strId, 10);
      });
      this.selectController = new app.Controllers.SelectController({
        hospitalIds: ids
      });
    } else {
      this.selectController = new app.Controllers.SelectController();
    }
  },

  showSearch: function() {
    this.homeController = new app.Controllers.HomeController();
    this.listenTo(this.homeController, 'compare:hospitals', this.showSelect);
  },

  showSelect: function(hospitalIds) {
    app.mainRouter.navigate('select/' + hospitalIds.join('/'));
    this.selectController = new app.Controllers.SelectController(hospitalIds);
  }
});
