'use strinct';

app.Controllers.MainController = Marionette.Controller.extend({
  initialize: function() {
    this.homeController = new app.Controllers.HomeController();
  },

  index: function() {},

  search: function(query) {
    this.homeController.search(query);
  },

  compare: function() {
    // Load CompareController
  }
});
