'use string';

app.Layouts = app.Layouts || {};

app.Layouts.Results = Marionette.Layout.extend({
  template: JST['templates/results-region'],

  regions: {
    map: '#map',
    selected: '#hospitals-selected',
    list: '#hospital-list'
  }
});
