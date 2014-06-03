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

  ui:{
    'button': '.compare'
  },

  itemEvents: {
    'select:hospital': 'selectHospital',
  },

  events: {
    'click .more-results': 'moreResults'
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },

  selectHospital: function(){
    var checkedHospitals = $('.hospital-selector:checked').length;

    if (checkedHospitals < 3){
      $('.hospital-selector').removeAttr('disabled');
    } else {
      $('.hospital-selector:not(:checked)').attr('disabled', 'disabled');
    }

    if (checkedHospitals > 1){
      this.showCompareButton();
    } else {
      this.hideCompareButton();
    }
  },

  moreResults: function(event) {
    event.preventDefault();
    this.trigger('more-results:hospitals');
  },

  showCompareButton: function(){
    this.ui.button.show();
  },

  hideCompareButton: function(){
    this.ui.button.hide();
  }
});
