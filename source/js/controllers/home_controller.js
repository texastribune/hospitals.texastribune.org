app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.searchView = new app.Views.Search();
    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });
    this.listenTo(this.searchView, 'list:hospitals', this.listHospitals);

    $('#explorer-introduction').show();
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
  listHospitals: function(){
    app.mainRouter.navigate('list');
    this.hospitalsController = new app.Controllers.HospitalsController();
  }
});
