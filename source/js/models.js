"use strict";

app.Models = app.Models || {};

app.Models.Hospital = Backbone.Model.extend({
  defaults: {
    distance: 'NA'
  }
});
