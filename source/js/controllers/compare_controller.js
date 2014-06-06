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

    app.narrowRegion.show(app.searchView);

    app.hospitalsView = new app.Views.Hospitals({
      collection: app.hospitals
    });

    this.listenTo(app.hospitalsView, 'hospital:selected', this.selectHospital);
    this.listenTo(app.hospitalsView, 'hospital:deselected', this.deselectHospital);

    app.mapRegion.show(app.mapView);
    app.compareRegion.show(this.compareHospitalsView);
    app.resultsRegion.show(app.hospitalsView);
    app.hospitalsView.selectResults([hospitalId]);
  },

  showCompare: function(hospitalIds) {},

  selectHospital: function(hospitalId) {
    var hospitalToCompare = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.add(hospitalToCompare.attributes);
  },

  deselectHospital: function(hospitalId) {
    var hospitalToRemove = app.hospitals.get(hospitalId);
    this.hospitalsToCompare.remove(hospitalToRemove);
  }
});