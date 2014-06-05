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
    'compare': '.compare'
  },

  itemEvents: {
    'select:hospital': 'selectHospital',
  },

  events: {
    'click @ui.compare': 'compare',
    'click a.more-results': 'moreResults'
  },

  compare: function(event) {
    var hospitalIds = [];

    event.preventDefault();
    $('.hospital-selector:checked').each(function(index) {
      hospitalIds.push($(this).data('id'));
    });
    this.trigger('compare:hospitals', hospitalIds);
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
    this.ui.compare.show();
  },

  hideCompareButton: function(){
    this.ui.compare.hide();
  }
});
