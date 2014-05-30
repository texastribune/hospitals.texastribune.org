"use strict";

app.Views.Hospital = Marionette.ItemView.extend({
  template: JST['templates/hospital-cell'],
  tagName: 'tr',
  className: 'hospital',

  ui: {
    'checkbox': '.hospital-selector'
  },

  events: {
    'click @ui.checkbox' : 'hospitalSelected'
  },

  templateHelpers: function(){
    var showDistance = this.model.hasDistance();
    return {
      showDistance: showDistance
    };
  },

  hospitalSelected: function(){
    this.trigger('select:hospital');
  }
});
