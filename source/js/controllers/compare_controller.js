'use strinct';

app.Controllers.CompareController = Marionette.Controller.extend({
  initialize: function(hospitalIds) {
    var loadingFn = _.after(hospitalIds.length, this.loaded)
    this.hospitalsJSON = [];
    this.on('hospital:loading', loadingFn);
    this.getHospitals(hospitalIds);
  },

  loaded: function() {
    this.hospitals = new app.Collections.Hospitals(this.hospitalsJSON)
    this.compareView = new app.Views.CompareView({
      collection: this.hospitals
    });
  },

  getHospitals: function(hospitalIds) {
    var self = this,
        jqxhr;

    _.each(hospitalIds, function(hospitalId) {
      jqxhr = $.get('/api/' + hospitalId + '.json', function(data) {
        self.hospitalsJSON.push(data);
        self.trigger('hospital:loading');
      });
    });
  }
});
