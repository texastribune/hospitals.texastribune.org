app.Controllers.SelectController = Marionette.Controller.extend({
  initialize: function(options) {
    this.maxHospitals = app.Settings.maxSelected;
    this.searchView  = new app.Views.Search({
      narrowSearch: true,
    });

    this.searchController = new app.Controllers.SearchController({
      view: this.searchView,
      collection: typeof options.results === 'undefined' ? [] : options.results
    });

    this.hospitalsView = new app.Views.Hospitals({
      collection: this.searchController.collection
    });

    // this.mapView = new app.Views.Map({
    //   collection: this.searchController.collection
    // });

    this.hospitalsToCompare = this.getHospitals(options.hospitalIds);

    this.compareHospitalsView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    this.layout = new app.Layouts.Results();
    app.narrowRegion.show(this.searchView);
    app.resultsRegion.show(this.layout);
    // this.layout.map.show(this.mapView);
    this.layout.list.show(this.hospitalsView);
    this.layout.selected.show(this.compareHospitalsView)
    this.listenTo(this.hospitalsView, 'more-results:hospitals', this.moreResults);
    this.listenTo(this.hospitalsView, 'hospital:selected', this.selectHospital);
    this.listenTo(this.hospitalsView, 'hospital:deselected', this.deselectHospital);
    this.listenTo(this.hospitalsView, 'render', this.syncronizeViews);

    this.preloadList(options);
    this.listenTo(this.compareHospitalsView, 'compare:hospitals', this.compare);
    this.listenTo(this.compareHospitalsView, 'remove:hospital', this.removeHospital);
    this.listenTo(this.searchController, 'after:search', this.syncronizeViews);

    this.syncronizeViews();
    $('#compare').html(''); // INPOT
  },

  onClose: function() {
    this.searchView.close();
    this.layout.close();
  },

  preloadList: function(options) {
    if (typeof options.searching !== 'undefined') {
      this.searchController.search(options.searching);
      app.mainRouter.navigate('search/' + this.searchController.searching);
    } else {
      this.searchController.search(this.getFirstZipcode());
    }
  },

  moreResults: function() {
    this.searchController.moreResults();
  },

  compare: function(ids) {
    app.compareController = new app.Controllers.CompareController(ids);
    this.close();
  },

  selectHospital: function(hospitalId) {
    this.hospitalsToCompare.add(app.hospitals.get(hospitalId));
    this.syncronizeViews();
  },

  deselectHospital: function(hospitalId) {
    this.hospitalsToCompare.remove(app.hospitals.get(hospitalId));
    this.syncronizeViews();
  },

  syncronizeViews: function() {
    this.checkSelectedHospitals();
    // this.mapView.checkHospitals(this.hospitalsToCompare);
    this.updateURL();
    if (this.hospitalsToCompare.length >= this.maxHospitals) {
      this.hospitalsView.disableSelection();
    } else {
      this.hospitalsView.enableSelection();
    }
  },

  checkSelectedHospitals: function() {
    this.hospitalsView.checkHospitals(this.hospitalsToCompare);
    // this.mapView.checkHospitals(this.hospitalsToCompare);
  },

  removeHospital: function(hospital) {
    this.hospitalsView.uncheck(hospital.id);
    // this.mapView.checkHospitals(this.hospitalsToCompare);
    this.syncronizeViews();
  },

  updateURL: function() {
    var ids = this.hospitalsToCompare.map(function(hospital) {
      return hospital.id;
    });
    app.mainRouter.navigate('select/' + ids.join('/'));
  },

  getHospitals: function(hospitalIds) {
    var hospitals = [];
    hospitalIds = typeof hospitalIds === 'undefined' ? [] : hospitalIds;

    _.each(hospitalIds, function(hospitalId) {
      hospitals.push(app.hospitals.get(hospitalId));
    });

    return (new app.Collections.Hospitals(hospitals));
  },

  getFirstZipcode: function() {
    var hospital;

    if (this.hospitalsToCompare && this.hospitalsToCompare.length > 0) {
      hospital = this.hospitalsToCompare.at(0);
      return hospital.get('zipcode');
    } else {
      return '';
    }
  }
});
