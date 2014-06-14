'use strict';

app.Controllers.HomeController = Marionette.Controller.extend( {
  initialize: function() {
    this.perPage = 10;
    this.searchView = new app.Views.Search();

    this.listenTo(this.searchView, 'call:search', this.search);
    this.listenTo(this, 'after:search', this.afterSearch);
    this.listenTo(this, 'error:search', this.errorSearch);
    this.centerLocation = [];

    app.searchRegion.show(this.searchView);
  },

  errorSearch: function(msg) {
    this.hideResults();
    this.searchView.showError(msg);
  },

  afterSearch: function(findings) {
    if(findings.length === 0){
      this.searchView.showEmpty();
    } else {
      this.showResults(findings);
    }
  },

  search: function(cad, page) {
    this.searching = cad;
    this.page = typeof page !== 'undefined' ?  page : 1;

    app.mainRouter.navigate('search/' + cad);
    if ( this.page === 1 ) this.hideResults();
    if(cad === 'nearest') {
      this.searchByLocation(this.page);
    } else if(/^\d{5}(-\d{4})?$/.test(cad)) {
      this.trigger('after:search', this.searchByZipcode(cad, this.page));
    } else {
      this.trigger('after:search', this.searchByName(cad, this.page));
    }
  },

  searchByLocation: function(page) {
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
    var coords = app.zipcodes[cad]; // {zipcode: [lat, lng]}

    if(coords){
      this.centerLocation = [coords[0], coords[1]];
      return this.searchByProximityTo(coords[0], coords[1]).
              slice((page-1) * this.perPage, page * this.perPage);
    } else {
      // TODO: Find a better error message
      this.trigger('error:search', 'That\'s not a Texas\' zipcde');
    }
  },

  searchByName: function(name, page) {
    var regex = new RegExp(name, 'i'),
        results;

    results = app.hospitals.filter(function(hospital) {
      if(hospital.get('name').toLowerCase().search(regex) !== -1){
        return hospital;
      }
    });
    this.centerLocation = [];
    return results.slice((page - 1) * this.perPage, page * this.perPage);
  },

  moreResults: function() {
    this.page += 1;
    this.search(this.searching, this.page);
  },

  showResults: function(results) {
    var collection = new app.Collections.Hospitals(results);

    if (typeof app.hospitalsView === 'undefined' || app.hospitalsView.isClosed) {
      app.hospitalsView = new app.Views.Hospitals( {
        collection: collection
      });
      this.listenTo(app.hospitalsView, 'more-results:hospitals', this.moreResults);
      this.listenTo(app.hospitalsView, 'compare:hospitals', this.compare);
      app.mapView = new app.Views.Map(this.centerLocation);
      app.mapRegion.show(app.mapView);
      app.resultsRegion.show(app.hospitalsView);
      app.mapView.scrollToMap();
    } else {
      app.hospitalsView.collection.add(collection.models);
    }
  },

  hideResults: function() {
    if (app.hospitalsView) app.hospitalsView.close();
    if (app.mapView) app.mapView.close();
  },

  searchByProximityTo: function(lat1, lng1) {
    var output,
        self = this;
    output = app.hospitals.sortBy(function(hospital) {
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

  compare: function(hospitalIds) {
    this.hideResults();
    this.searchView.close();
    this.trigger('compare:hospitals', hospitalIds);
  }
});
