'use strinct';

/* APPLICATION */
window.app = new Marionette.Application();

app.Views = app.Views || {};
app.Controllers = app.Controllers || {};

app.addRegions({
  searchRegion:  '#search',
  narrowRegion:  '#narrow-search',
  resultsRegion: '#results',
  compareRegion: '#compare',
  selectedRegion: '#selected-hospitals'
});

app.Routers = app.Routers || {};

app.Routers.Main = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    '': 'index',
    'search/:query': 'search',
    'select/*hospitalIds': 'select',
    'compare/*hospitalIds': 'compare',
    '*default': 'index'
  }
});

app.dataLoaded = function dataLoaded() {
  // This function will be called as soon as
  // zipCodes, geoData and hospitals are loaded

  this.mainRouter = new app.Routers.Main( {
    controller: new app.Controllers.MainController()
  });
  if ( Backbone.history ) {
    Backbone.history.start();
  }
};

app.loading = _.after(3, app.dataLoaded);

app.vent.on('dataLoaded', function() {
  app.loading();
});

app.on('initialize:before', function() {
  app.hospitals = new app.Collections.Hospitals();
  app.hospitals.on('reset', function() {
    app.vent.trigger('dataLoaded');
  });
  app.hospitals.fetch( { reset: true } );
});

app.on('initialize:before', function() {
  var jqxhr;

  jqxhr = $.getJSON( '/api/zipcodes.json', function(data) {
    app.zipcodes = data;
    app.vent.trigger('dataLoaded');
  })
  .fail(function() {
    app.zipcodes = [];
  });
});

app.on('initialize:before', function() {
  var self = this,
      process;

  process = function process(geoData) {
    var markerOptions = {
      'marker-color':  '#fc4353',
      'marker-size':   'large',
      'marker-symbol': 'hospital'
    };
    geoData.features.forEach(function(feature) {
      _.extend(feature.properties, markerOptions);
    });
    return geoData;
  };
  $.getJSON('/api/hospitals.geojson', function(geoData) {
    self.geoData = process(geoData);
    self.vent.trigger('dataLoaded');
  }).fail(function() {
    self.geoData = {};
  });
});

$(document).ready(function(){
  app.start();
});
