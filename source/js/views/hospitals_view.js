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
    'checked:hospital': 'hospitalChecked',
    'unchecked:hospital': 'hospitalUnchecked'
  },

  events: {
    'click @ui.compare': 'compare',
    'click a.more-results': 'moreResults'
  },

  hospitalChecked: function(eventName, itemView, una) {
    this.trigger('hospital:selected', itemView.model.id);
  },

  hospitalUnchecked: function(eventName, itemView) {
    this.trigger('hospital:deselected', itemView.model.id);
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

  selectHospital: function(eventName, itemView){
    var checkedHospitals = $('.hospital-selector:checked').length;

    if (itemView.model.get('selected')) {
      this.trigger('check:hospital', itemView.model.get('id'));
    } else {
      this.trigger('uncheck:hospital', itemView.model.get('id'));
    }

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
  },

  selectResults: function(ids) {
    var self = this;

    _.each(ids, function(id) {
      if (self.collection.get(id)) {
        self.check(id);
      }
    });
  },

  check: function(id) {
    this.$el.find('*[data-id="' + id +'"]').prop('checked', true);
  },

  uncheck: function(id) {
    this.$el.find('*[data-id="' + id +'"]').prop('checked', false);
  }
});
