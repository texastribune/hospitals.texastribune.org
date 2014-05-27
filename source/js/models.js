"use strict";

app.Models = app.Models || {};

app.Models.Hospital = Backbone.Model.extend({
  defaults: {
    distance: 'NA'
  },

  hasDistance: function(){
    return !(this.get('distance') === '' || this.get('distance') === 'NA');
  }
});
