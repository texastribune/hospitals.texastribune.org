app.Views.HospitalToCompare = Marionette.ItemView.extend({
  template: JST['templates/hospital-to-compare'],
  tagName: 'div',

  ui: {
    'removeButton': 'a.remove'
  },

  events: {
    'click @ui.removeButton' : 'removeHospital'
  },

  removeHospital: function(event){
    event.preventDefault();
    this.trigger('remove:hospital', event.currentTarget.dataset.id);
  }
});
