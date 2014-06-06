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
  },

  showCompare: function(hospitalIds) {}
});