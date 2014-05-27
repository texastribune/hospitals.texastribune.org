"use strict";

app.Views = app.Views || {};

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
  },

  scrollToMap: function(){
    var scrollTo = this.$el.offset().top;
    $('body,html').animate({scrollTop: scrollTo}, 1000)
  }
});

app.Views.Hospital = Marionette.ItemView.extend({
  template: JST['templates/hospital-cell'],
  tagName: 'tr',
  className: 'hospital',
  templateHelpers: function(){
    var showDistance = this.model.hasDistance();
    return {
      showDistance: showDistance
    };
  }
});

app.Views.HospitalEmpty = Marionette.CompositeView.extend({
  template: JST['templates/no-hospitals']
});

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