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
    this.hospitalsToCompare = new app.Views.HospitalsToCompare({
      collection: new app.Collections.Hospitals([hospital])
    });
    app.compareRegion.show(this.hospitalsToCompare);
    app.mapView = new app.Views.Map(hospital.coordinates());
    app.searchView  = new app.Views.Search({
      narrowSearch: true,
    });

    app.mapRegion.show(app.mapView);
    app.narrowRegion.show(app.searchView);
  },

  showCompare: function(hospitalIds) {}
});