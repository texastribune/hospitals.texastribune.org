app.Controllers.CompareController = Marionette.Controller.extend({
  initialize: function(hospitalIds) {
    var loadingFn = _.after(hospitalIds.length, this.loaded);
    this.hospitalsJSON = [];
    this.on('hospital:loading', loadingFn);
    this.getHospitals(hospitalIds);

    app.mainRouter.navigate('compare/' + hospitalIds.join('/'));
    this.hospitalIds = hospitalIds;
    $('#explorer-introduction').hide();
  },

  onClose: function() {
    this.compareView.close();
  },

  loaded: function() {
    this.hospitals = new app.Collections.Hospitals(this.hospitalsJSON);
    this.compareView = new app.Views.CompareView({
      collection: this.hospitals
    });
    app.compareRegion.show(this.compareView);

    this.listenTo(this.compareView, 'select:hospitals', this.showSelect);
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
  },

  showSelect: function() {
    this.close();
    app.currentController = new app.Controllers.SelectController({
      hospitalIds: this.hospitalIds
    });
  }
});
