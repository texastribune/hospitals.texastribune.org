app.Controllers.SearchController = Marionette.Controller.extend({
  initialize: function(options) {
    this.page = 1;
    this.perPage = 9;
    this.center = [31.35, -99.64];
    this.view = options.view;

    this.listenTo(this.view, 'call:search', this.search);
    this.listenTo(this, 'more-results:search', this.moreResults);
    this.listenTo(this, 'around:search', this.updateResults);

    if (options.collection && options.collection.length > 0) {
      this.collection = options.collection;
    } else {
      this.collection = new app.Collections.Hospitals();
    }

    if (this.collection.length === 0 && options.begin) {
      this.search(options.begin);
    }
  },

  onClose: function() {
    this.view.close();
  },

  updateResults: function(findings) {
    if (this.page === 1) {
       this.collection.reset(findings);
    } else {
      this.collection.add(findings);
      this.collection.trigger('collection:updated');
    }
    this.trigger('after:search');
    this.view.trigger('search:completed');
  },

  moreResults: function() {
    this.page += 1;
    this.search(this.searching, this.page);
  },

  search: function(cad, page) {
    this.searching = cad;
    this.page = typeof page !== 'undefined' ?  page : 1;

    if(cad === 'nearest') {
      this.searchByLocation(this.page);
    } else {
      this.searchbyAddress(cad, this.page);
    }
  },

  searchbyAddress: function(cad, page) {
    var self = this;
    var query = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + encodeURIComponent(cad) + '.json?access_token=pk.eyJ1IjoidGV4YXN0cmlidW5lIiwiYSI6Ilo2eDhZWmcifQ.19qcXfOTN6ulkGW5oouiPQ';

    $.get(query).done(function(data) {
      var coords = data.features[0].geometry.coordinates;
      self.centerLocation = [coords[1], coords[0]];
      var results = self.searchByProximityTo(coords[1], coords[0]).slice((page-1) * self.perPage, page * self.perPage);

      self.trigger('around:search', results);
    });
  },

  searchByName: function(name, page) {
    var regex = new RegExp(name, 'i'),
        results;

    results = app.hospitals.filter(function(hospital) {
      if(hospital.get('name').toLowerCase().search(regex) !== -1){
        return hospital;
      }
    });
    this.center = [];
    results = results.slice((page - 1) * this.perPage, page * this.perPage);
    this.trigger('around:search', results);
  },

  searchByLocation: function(page) {
    var self = this,
        locationFound,
        noGeolocation,
        results;

    locationFound = function(position) {
      self.centerLocation = [position.coords.latitude,
                              position.coords.longitude];
      results = self.searchByProximityTo(
        position.coords.latitude,
        position.coords.longitude
      ).slice((page - 1) * self.perPage, page * self.perPage);
      app.position = position;
      self.trigger('around:search', results);
    };

    noGeolocation = function() {
      self.trigger('error:search', 'No luck finding you! How about trying with an address?');
    };

    if ('geolocation' in navigator) {
      if (typeof app.position === 'undefined') {
        navigator.geolocation.getCurrentPosition(locationFound, noGeolocation);
      } else {
        locationFound(app.position);
      }
      noGeolocation();
    }
  },

  searchByProximityTo: function(lat1, lng1) {
    var self = this,
        output;

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
    };

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
  }
});
