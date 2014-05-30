"use strict";

app.Views.Map = Marionette.ItemView.extend({
  template: JST['templates/map'],

  initialize: function(center){
    if (center.length ===1){
      this.center = [31.35, -99.64];
      this.zoomLevel = 4;
    } else {
      this.center = center;
      this.zoomLevel = 17;
    }
  },

  serializeData: function(){
    return {};
  },

  onShow: function(){
    console.log(this.el);
    this.map = L.mapbox.map('map-location', 'texastribune.map-vjiayly8',{
      minZoom: 5,
      maxZoom: 10
      })
      .setView(this.center, this.zoomLevel)
      .featureLayer.setGeoJSON(app.geoData);
  },

  scrollToMap: function(){
    var scrollTo = this.$el.offset().top;
    $('body,html').animate({scrollTop: scrollTo}, 1000)
  }
});
