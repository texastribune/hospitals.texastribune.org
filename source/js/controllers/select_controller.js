'use strinct';

app.Controllers.SelectController = Marionette.Controller.extend({
  initialize: function(hospitalIds) {
    this.hospitalsToCompare = this.getHospitals(hospitalIds);
    this.compareHospitalsView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    app.mapView = new app.Views.Map(this.getCenter());
    app.searchView  = new app.Views.Search({
      narrowSearch: true,
    });

    this.betaController = new app.Controllers.BetaController({
      view: app.searchView,
      begin: this.getFirstZipcode()
    });

    app.hospitalsView = new app.Views.Hospitals({
      collection: this.betaController.collection
    });

    this.listenTo(this.hospitalsToCompare, 'remove', this.removeHospital);
    this.listenTo(app.hospitalsView, 'hospital:selected', this.selectedHospital);
    this.listenTo(app.hospitalsView, 'hospital:deselected', this.deselectedHospital);
    this.listenTo(app.hospitalsView, 'more-results:hospitals', this.moreResults);

    app.selectRegion.show(this.compareHospitalsView);
    app.narrowRegion.show(app.searchView);
    app.mapRegion.show(app.mapView);
    app.resultsRegion.show(app.hospitalsView);

    app.hospitalsView.selectResults(hospitalIds);
  },

  showCompare: function(hospitalIds) {},

  moreResults: function() {
    this.betaController.moreResults();
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