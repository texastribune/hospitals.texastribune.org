'use strict';

app.Views.HospitalsToCompare = Marionette.CompositeView.extend({
  template: JST['templates/hospitals-to-compare'],
  itemView: app.Views.HospitalToCompare,
  emptyView: app.Views.HospitalEmpty,

  itemEvents: {
    "remove:hospital": 'removeHospitalClicked'
  },

  ui: {
    'compare': '.compare'
  },

  events: {
    'click @ui.compare': 'compare'
  },

  onAfterItemAdded: function(itemView) {
    this.isReadyToCompare();
  },

  onItemRemoved: function(itemView){
    this.isReadyToCompare();
  },

  appendHtml: function(collectionView, itemView){
    if (collectionView.$('tbody').length === 0) {
      collectionView.$el.append(this.template())
    }
    collectionView.$("tbody").append(itemView.el);
  },

  compare: function(event) {
    var hospitalIds = [];

    event.preventDefault();
    $('.hospital-selector:checked').each(function(index) {
      hospitalIds.push($(this).data('id'));
    });
    this.trigger('compare:hospitals', hospitalIds);
  },

  removeHospitalClicked: function(eventName, itemView, hospitalId) {
    this.collection.remove(itemView.model);
    this.trigger('remove:hospital', itemView.model);
  },

  isReadyToCompare: function() {
    if (this.collection.length > 1) {
      this.showCompareButton();
      this.trigger('readyToCompare:hospitals');
    } else {
      this.hideCompareButton();
      this.trigger('notReadyToCompare:hospitals');
    }
  },

  showCompareButton: function() {
    this.$el.find('button.compare').show();
  },

  hideCompareButton: function() {
    this.$el.find('button.compare').hide()
  }
});
