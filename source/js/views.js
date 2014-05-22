"use strict";

app.Views = app.Views || {};

app.Views.Search = Marionette.ItemView.extend({
  template: '#search-template',

  ui: {
    input: "input[type='search']",
    error: ".error"
  },
  events: {
    'click button': 'nearestHospitals',
    'click input': 'hideError',
    'submit form': 'submit'
  },

  submit: function(event){
    event.preventDefault();
    var cad = this.ui.input.val().trim().toLowerCase();
    if (cad === ""){
      this.showError();
    } else {
      this.trigger("call:search", cad);
    }
  },

  showError: function(){
    this.ui.error.show();
  },

  hideError: function(){
    this.ui.error.hide();
  },

  nearestHospitals: function(event){
    event.preventDefault();
    this.hideError();
    this.trigger("neartest:search");
  }
});

app.Views.Map = Marionette.ItemView.extend({
  template: "#map-template",

  initialize: function(collection){
    this.collection = collection;
  },

  serializeData: function(){
    return {};
  }
});

app.Views.Hospital = Marionette.ItemView.extend({
  template: "#hospital-template",
  tagName: 'tr',
  className: 'hospital'
});

app.Views.HospitalEmpty = Marionette.CompositeView.extend({
  template: "#no-hospitals-template"
});

app.Views.Hospitals = Marionette.CompositeView.extend({
  template: "#hospitals-template",
  itemView: app.Views.Hospital,
  emptyView: app.Views.HospitalsEmpty,

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});