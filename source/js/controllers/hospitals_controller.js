app.Controllers.HospitalsController = Marionette.Controller.extend( {
  initialize: function() {
    this.view = new app.Views.HospitalsList({
      collection: app.hospitals
    });
    app.searchRegion.show(this.view);
  },

  onClose: function() {
    this.view.close();
  }
});
