'use strict';

app.Views.Map = Marionette.ItemView.extend({
  template: JST['templates/map'],

  initialize: function(options){
    this.collection = options.collection;
    this.listenTo(this.collection, 'reset', this.update);
    this.listenTo(this.collection, 'collection:updated', this.update);
  },

  serializeData: function(){
    return {};
  },

  onShow: function(){
    this.map = L.mapbox.map('map-location', app.Settings.mapId,{
      minZoom: 5,
      maxZoom: 17
    });
    this.featureLayer = L.mapbox.featureLayer()
      .addTo(this.map)
      .setGeoJSON(app.geoData);
  },

  update: function() {
    var ids = this.collection.map(function(hospital) {
      return hospital.id.toString();
    });

    this.featureLayer.setFilter(function(featureObject) {
      return _.contains(ids, featureObject.properties.id);
    });
    this.map.fitBounds(this.featureLayer.getBounds());
  },

  checkHospitals: function(hospitals) {
    this.resetMarkers();
    _.each(app.geoData.features, function(feature) {
      if (hospitals.get(feature.properties.id)) {
        feature.properties['marker-color'] = app.Settings.markerSelectedColor;
      }
    });
    this.featureLayer.setGeoJSON(app.geoData);
  },

  resetMarkers: function() {
    _.each(app.geoData.features, function(feature) {
      feature.properties['marker-color'] = app.Settings.markerColor;
    });
    this.featureLayer.setGeoJSON(app.geoData);
  }
});
