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

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});
