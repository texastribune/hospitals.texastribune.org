"use strict";

app.Views.HospitalToCompare = Marionette.ItemView.extend({
  template: JST['templates/hospital-to-compare'],
  tagName: 'tr',

  ui: {
    'removeButton': 'button.remove'
  },

  events: {
    'click @ui.removeButton' : 'removeHospital'
  },

  removeHospital: function(event){
    event.preventDefault();
    this.trigger('remove:hospital', event.currentTarget.dataset.id);
  }
});
