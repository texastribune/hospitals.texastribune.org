app.Controllers.HospitalsController = Marionette.Controller.extend( {
  initialize: function() {
    this.view = new app.Views.HospitalsList({
      collection: app.hospitals
    });

    app.searchRegion.show(this.view);
    $('#explorer-introduction').show();
  },

  onClose: function() {
    this.view.close();
  }
});
