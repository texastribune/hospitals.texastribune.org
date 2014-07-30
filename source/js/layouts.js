app.Layouts = app.Layouts || {};

app.Layouts.Results = Marionette.Layout.extend({
  template: JST['templates/results-region'],

  regions: {
    search: '#search-bar',
    map: '#map',
    list: '#hospital-list',
    selectedTop: '#selected-top',
    selectedBottom: '#selected-bottom'
  }
});
