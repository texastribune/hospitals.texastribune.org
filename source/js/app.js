'use strinct';

/* APPLICATION */
window.app = new Marionette.Application();

app.Views = app.Views || {};
app.Controllers = app.Controllers || {};

app.addRegions({
  headerRegion: "#header",
  searchRegion: "#search",
  mapRegion: "#map",
  resultsRegion: "#results",
  footerRegion: "#footer"
});

app.Routers = app.Routers || {};
app.Routers.Main = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    '': 'index',
    'query:cad': 'search'
  }
});

app.addInitializer(function(options){
  var mainRouter = new app.Routers.Main({
    controller: new app.Controllers.HomeController()
  });
});

app.on("initialize:after", function(){
  if(Backbone.history){
    Backbone.history.start();
  }
});

app.on("initialize:before", function(){
  var self = this;
  var process = function(geoData){
    var markerOptions = {
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "hospital"
    };
    geoData.features.forEach(function(feature){
      _.extend(feature.properties, markerOptions);
    });
    return geoData;
  };
  $.getJSON('/api/hospitals.geojson', function(geoData){
    self.geoData = process(geoData);
  }).fail(function(){
    this.geoData = {};
  });
});

$(document).ready(function(){
  app.start();
});
