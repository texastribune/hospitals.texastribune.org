'use strict';

app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.perPage = 10;
    this.searchView = new app.Views.Search();
    this.hospitals = new app.Collections.Hospitals();
    this.hospitals.fetch();
    this.fetchZipcodes();

    this.listenTo(this.searchView, 'call:search', this.search);
    this.listenTo(this, 'after:search', this.afterSearch);
    this.listenTo(this, 'error:search', this.errorSearch);
    this.centerLocation = [];

    app.searchRegion.show(this.searchView);
  },

  index: function() {},

  show: function(id) {},

  errorSearch: function(msg) {
    this.hideResults();
    this.searchView.showError(msg);
  },

  afterSearch: function(findings) {
    this.hideResults();
    if(findings.length === 0){
      this.searchView.showEmpty();
    } else {
      this.showResults(findings);
    }
  },

  search: function(cad, page) {
    this.page = typeof page !== 'undefined' ?  page : 1;
    if(cad === 'nearest') {
      this.nearest(this.page);
    } else if(/^\d{5}(-\d{4})?$/.test(cad)) {
      this.trigger('after:search', this.searchByZipcode(cad, this.page));
    } else {
      this.trigger('after:search', this.searchByName(cad, page));
    }
  },

  nearest: function(page) {
    var self = this,
        findings;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.centerLocation = [position.coords.latitude,
                                position.coords.longitude];
        findings = self.searchByProximityTo(
            position.coords.latitude,
            position.coords.longitude
        ).slice((page - 1) * self.perPage, page * self.perPage);

        self.trigger('after:search', findings);
      }, function() {
        // TODO: Find a better error message
        self.trigger('error:search', 'Geolocation is not working.');
      });
    }
  },

  searchByZipcode: function(cad, page) { // 76244
    var coords = this.zipcodes[cad]; // {zipcode: [lat, lng]}

    if(coords){
      this.centerLocation = [coords[0], coords[1]];
      return this.searchByProximityTo(coords[0], coords[1]).
              slice((page-1) * this.perPage, page * this.perPage);
    } else {
      // TODO: Find a better error message
      this.trigger('error:search', 'That\'s not a Texas\' zipcde');
    }
  },

  searchByName: function(name) {
    var regex = new RegExp(name, 'i'),
        results;

    results = this.hospitals.filter(function(hospital) {
      if(hospital.get('name').toLowerCase().search(regex) !== -1){
        return hospital;
      }
    });
    this.centerLocation = [];
    return results;
  },

  showResults: function(results) {
    var collection = new app.Collections.Hospitals(results);
    app.hospitalsView = new app.Views.Hospitals( {
      collection: collection
    });
    app.mapView = new app.Views.Map(this.centerLocation);
    app.mapRegion.show(app.mapView);
    app.resultsRegion.show(app.hospitalsView);
    app.mapView.scrollToMap();
  },

  hideResults: function() {
    if (app.hospitalsView) app.hospitalsView.close();
    if (app.mapView) app.mapView.close();
  },

  searchByProximityTo: function(lat1, lng1) {
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

  distanceFromLatLng: function(lat1, lon1, lat2, lon2) {
    var R = 3958, // Radius of the earth in miles
        deg2rad,
        dLat,
        dLon,
        a,
        c,
        d;

    deg2rad = function deg2rad(deg) {
      return deg * (Math.PI/180);
    }

    dLat = deg2rad(lat2-lat1);
    dLon = deg2rad(lon2-lon1);
    a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    d = R * c; // Distance in miles
    return d;
  },

  fetchZipcodes: function() {
    var self = this,
        jqxhr;

    jqxhr = $.getJSON( '/api/zipcodes.json', function(data) {
      self.zipcodes = data;
    })
    .fail(function() {
      self.zipcodes = [];
    });
  }
});
