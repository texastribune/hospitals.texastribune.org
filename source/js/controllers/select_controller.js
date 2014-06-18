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

    this.mapView = new app.Views.Map(this.getCenter());

    this.hospitalsToCompare = this.getHospitals(options.hospitalIds);

    this.compareHospitalsView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    if (typeof options.searching !== 'undefined') {
      this.searchController.search(options.searching);
    }

    this.layout = new app.Layouts.Results();
    app.narrowRegion.show(this.searchView);
    app.resultsRegion.show(this.layout);
    this.layout.map.show(this.mapView)
    this.layout.list.show(this.hospitalsView);
    this.layout.selected.show(this.compareHospitalsView);
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