app.Views.HospitalListed = Marionette.ItemView.extend({
  template: JST['templates/hospital-listed'],
  className: 'search-box',
  tagName: 'tr',
  templateHelpers: function() {
    return {
      hasOldUrl: !!(this.model.get('old_url'))
    };
  }
});
