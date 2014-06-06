'use strinct';

app.Controllers.CompareController = Marionette.Controller.extend({
  initialize: function(hospitalIds) {
    if (hospitalIds.length === 1) {
      this.showCompareAndSearch(hospitalIds[0]);
    } else {
      this.showCompare(hospitalIds);
    }
  },

  showCompareAndSearch: function(hospitalId) {
    var hospital = app.hospitals.get(hospitalId);
    this.hospitalsToCompare = new app.Collections.Hospitals([hospital])

    this.compareHospitalsView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    app.mapView = new app.Views.Map(hospital.coordinates());
    app.searchView  = new app.Views.Search({
      narrowSearch: true,
    });

    app.hospitalsView = new app.Views.Hospitals({
      collection: app.hospitals
    });

    this.listenTo(this.hospitalsToCompare, 'remove', this.removeHospital);
    this.listenTo(app.hospitalsView, 'hospital:selected', this.selectedHospital);
    this.listenTo(app.hospitalsView, 'hospital:deselected', this.deselectedHospital);

    app.narrowRegion.show(app.searchView);
    app.mapRegion.show(app.mapView);
    app.compareRegion.show(this.compareHospitalsView);
    app.resultsRegion.show(app.hospitalsView);
    app.hospitalsView.selectResults([hospitalId]);
  },

  showCompare: function(hospitalIds) {},

  selectedHospital: function(hospitalId) {
    var hospitalToCompare = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.add(hospitalToCompare.attributes);
  },

  deselectedHospital: function(hospitalId) {
    var hospitalToRemove = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.remove(hospitalToRemove);
  },

  removeHospital: function(hospital) {
    app.hospitalsView.uncheck(hospital.id);
  }
});