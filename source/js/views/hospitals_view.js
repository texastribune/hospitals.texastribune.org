"use strict";

app.Views.Hospitals = Marionette.CompositeView.extend({
  template: JST['templates/hospitals'],
  itemView: app.Views.Hospital,
  emptyView: app.Views.HospitalsEmpty,

  templateHelpers: function(){
    var showDistance = this.collection.at(0).hasDistance();
    return {
      showDistance: showDistance
    };
  },

  itemEvents: {
    'select:hospital': 'selectHospital',
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },

  selectHospital: function(){
    if ($('.hospital-selector:checked').length < 3){
      $('.hospital-selector').removeAttr('disabled');
    } else {
      $('.hospital-selector:not(:checked)').attr('disabled', 'disabled');
    }
  },
});
