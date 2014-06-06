"use strict";

app.Models = app.Models || {};

app.Models.Hospital = Backbone.Model.extend({
  idAttribute:"_id",

  defaults: {
    distance: 'NA'
  },

  hasDistance: function(){
    return !(this.get('distance') === '' || this.get('distance') === 'NA');
  },

  coordinates: function() {
    return [this.get('latitude'), this.get('longitude')];
  }
});
