app.Controllers.HospitalsController = Marionette.Controller.extend( {
  initialize: function(slug) {
    if (typeof slug === 'undefined') {
      this.view = new app.Views.HospitalsList({
        collection: app.hospitals
      });
    } else {
      this.hospital = app.hospitals.find(function(hospital) {
        return hospital.get('url') === slug;
      });
      if (this.hospital !== undefined) {
        this.view = new app.Views.HospitalShow({
          model: this.hospital
        });
      }
    }
    app.searchRegion.show(this.view);
  },

  onClose: function() {
    this.view.close();
  }
});
