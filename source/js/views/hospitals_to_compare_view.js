'use strict';

app.Views.HospitalsToCompare = Marionette.CollectionView.extend({
  template: JST['templates/hospitals-to-compare'],
  itemView: app.Views.HospitalToCompare,
  emptyView: app.Views.HospitalEmpty,

  ui:{},

  itemEvents: {},

  events: {},

  appendHtml: function(collectionView, itemView){
    collectionView.$el.append(this.template())
    collectionView.$("tbody").append(itemView.el);
  }
});
