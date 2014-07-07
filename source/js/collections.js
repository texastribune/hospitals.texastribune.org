app.Collections = app.Collections || {};

app.Collections.Hospitals = Backbone.Collection.extend({
  url: 'api/hospitals.json',
  model: app.Models.Hospital
});
