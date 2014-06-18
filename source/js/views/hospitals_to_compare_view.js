'use strict';

app.Views.HospitalsToCompare = Marionette.CollectionView.extend({
  template: JST['templates/hospitals-to-compare'],
  itemView: app.Views.HospitalToCompare,
  emptyView: app.Views.HospitalEmpty,

  itemEvents: {
    "remove:hospital": 'removeHospitalClicked'
  },

  events: {},

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
