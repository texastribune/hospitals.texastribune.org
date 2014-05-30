"use strict";

app.Views.Hospital = Marionette.ItemView.extend({
  template: JST['templates/hospital-cell'],
  tagName: 'tr',
  className: 'hospital',
  templateHelpers: function(){
    var showDistance = this.model.hasDistance();
    return {
      showDistance: showDistance
    };
  }
});
