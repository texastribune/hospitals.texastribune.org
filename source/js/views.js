"use strict";

app.Views = app.Views || {};

app.Views.ErrorMessage = Marionette.ItemView.extend({
  template: JST['templates/error-message'],

  initialize: function(message){
    this.message = message
  },

  serializeData: function(){
    return {message: this.message};
  }
});

app.Views.Search = Marionette.ItemView.extend({
  template: JST['templates/search-template'],

  ui: {
    input: "input[type='search']",
    error: '.error',
    empty: '.empty'
  },
  events: {
    'click button': 'nearestHospitals',
    'click input': 'hideError',
    'submit form': 'submit'
  },

  submit: function(event){
    event.preventDefault();
    var cad = this.ui.input.val().trim().toLowerCase();
    this.hideEmpty();
    if (cad === ''){
      // TODO: find a better message
      this.showError('Please type a Zipcode or a Hospital Name');
    } else {
      this.trigger("call:search", cad);
    }
  },

  showError: function(text){
    this.ui.error.html(text).show();
  },

  hideError: function(){
    this.ui.error.hide();
  },

  showEmpty: function(){
    this.ui.empty.show();
  },

  hideEmpty: function(){
    this.ui.empty.hide();
  },

  nearestHospitals: function(event){
    event.preventDefault();
    this.hideError();
    this.hideEmpty();
    this.trigger("neartest:search");
  }
});

app.Views.Map = Marionette.ItemView.extend({
  template: JST['templates/map'],

  initialize: function(collection){
    this.collection = collection;
  },

  serializeData: function(){
    return {};
  }
});

app.Views.Hospital = Marionette.ItemView.extend({
  template: JST['templates/hospital-cell'],
  tagName: 'tr',
  className: 'hospital'
});

app.Views.HospitalEmpty = Marionette.CompositeView.extend({
  template: JST['templates/no-hospitals']
});

app.Views.Hospitals = Marionette.CompositeView.extend({
  template: JST['templates/hospitals'],
  itemView: app.Views.Hospital,
  emptyView: app.Views.HospitalsEmpty,

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});