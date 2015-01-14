app.Views.HospitalListed = Marionette.ItemView.extend({
  template: JST['templates/hospital-listed'],
  className: 'search-box',
  tagName: 'tr',
  templateHelpers: function() {
    return {
      has_old_url: !!(this.model.get('old_url'))
    };
  }
});
