app.Views.HospitalsList = Marionette.CompositeView.extend({
  template: JST['templates/hospitals-list'],
  itemView: app.Views.HospitalListed,
  itemViewContainer: 'tbody',

  onShow: function() {
  }
});
