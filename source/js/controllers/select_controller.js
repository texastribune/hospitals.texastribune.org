'use strinct';

app.Controllers.SelectController = Marionette.Controller.extend({
  initialize: function(options) {
    this.searchView  = new app.Views.Search({
      narrowSearch: true,
    });

    this.searchController = new app.Controllers.SearchController({
      view: this.searchView
    });

    this.hospitalsView = new app.Views.Hospitals({
      collection: this.searchController.collection
    });

    app.mapView = new app.Views.Map(this.getCenter());

    if (typeof options.searching !== 'undefined') {
      this.searchController.search(options.searching);
    }

    app.mapRegion.show(app.mapView);
    app.narrowRegion.show(this.searchView);
    app.resultsRegion.show(this.hospitalsView);
  },

  showCompare: function(hospitalIds) {},

  moreResults: function() {
    this.searchController.moreResults();
  },

  selectedHospital: function(hospitalId) {
    var hospitalToCompare = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.add(hospitalToCompare.attributes);
    this.updateURL();
  },

  deselectedHospital: function(hospitalId) {
    var hospitalToRemove = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.remove(hospitalToRemove);
    this.updateURL();
  },

  removeHospital: function(hospital) {
    app.hospitalsView.uncheck(hospital.id);
    this.updateURL();
  },

  updateURL: function() {
    var ids = this.hospitalsToCompare.map(function(hospital) {
      return hospital.id;
    });
    app.mainRouter.navigate('select/' + ids.join('/'));
  },

  getCenter: function() {
    var hospital;

    if (this.hospitalsToCompare && this.hospitalsToCompare.length > 0) {
      hospital = this.hospitalsToCompare.at(0);
      return [hospital.get('latitude'), hospital.get('longitude')];
    } else {
      return [];
    }
  },

  getHospitals: function(hospitalIds) {
    var hospitals = [];

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