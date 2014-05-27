"use strict";

app.Controllers = app.Controllers || {};

app.Controllers.HomeController = Marionette.Controller.extend({
  initialize: function(){
    this.searchView = new app.Views.Search();
    this.hospitals = new app.Collections.Hospitals();
    this.hospitals.fetch();
    this.fetchZipcodes();

    this.listenTo(this.searchView, "call:search", this.search);
    this.listenTo(this.searchView, "neartest:search", this.nearest);
    this.listenTo(this, "after:search", this.afterSearch);
    this.listenTo(this, "error:search", this.errorSearch);

    app.searchRegion.show(this.searchView);
  },

  index: function(){},

  show: function(id){},

  errorSearch: function(msg){
    this.hideResults();
    this.searchView.showError(msg);
  },

  afterSearch: function(findings){
    this.hideResults();
    if(findings.length === 0){
      this.searchView.showEmpty();
    } else {
      this.showResults(findings);
    }
  },

  search: function(cad){
    var findings;
    if(/^\d{5}(-\d{4})?$/.test(cad)){
      this.trigger('after:search', this.searchByZipcode(cad));
    } else {
      this.trigger('after:search', this.searchByName(cad));
    }
  },

  nearest: function(){
    var self = this,
        findings;
    if ("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(function(position) {
        findings = self.searchByProximityTo(
            position.coords.latitude,
            position.coords.longitude
        ).slice(0, 10)
        self.trigger('after:search', findings);
      }, function(){
        // TODO: Find a better error message
        self.trigger('error:search', "Geolocation is not working.");
      });
    }
  },

  searchByZipcode: function(cad){ // 76244
    var coords = this.zipcodes[cad]; // {zipcode: [lat, lng]}

    if(coords){
      return this.searchByProximityTo(coords[0], coords[1]).slice(0, 10);
    } else {
      // TODO: Find a better error message
      this.trigger('error:search', "That's not a Texas' zipcde");
    }
  },

  searchByName: function(name){
    var results,
        regex = new RegExp(name, "i");
    results = this.hospitals.filter(function(hospital){
      if(hospital.get('name').toLowerCase().search(regex) !== -1){
        return hospital;
      }
    });
    return results;
  },

  showResults: function(results){
    var collection = new app.Collections.Hospitals(results);
    app.hospitalsView = new app.Views.Hospitals({
      collection: collection
    });
    app.mapView = new app.Views.Map(this.hospitals);
    app.mapRegion.show(app.mapView);
    app.resultsRegion.show(app.hospitalsView);
  },

  hideResults: function(){
    if (app.hospitalsView){
      app.hospitalsView.close();
    }
    if (app.mapView){
      app.mapView.close();
    }
  },

  searchByProximityTo: function(lat1, lng1){
    var output,
        self = this;
    output = this.hospitals.sortBy(function(hospital){
      var distance = self.distanceFromLatLng(
        lat1, lng1, hospital.get('latitude'), hospital.get('longitude'));
      hospital.set('distance', distance.toFixed(1));

      return distance;
    });
    return output;
  },

  distanceFromLatLng: function(lat1, lon1, lat2, lon2){
    function deg2rad(deg) {
      return deg * (Math.PI/180);
    }
    var R = 3958; // Radius of the earth in miles
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in miles
    return d;
  },

  fetchZipcodes: function(){
    var self = this;
    var jqxhr = $.getJSON( "/api/zipcodes.json", function(data) {
      self.zipcodes = data;
    })
    .fail(function() {
      self.zipcodes = [];
    });
  }
});
