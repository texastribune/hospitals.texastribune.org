"use strict";

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

  initialize: function(options) {
    this.narrowSearch = options.narrowSearch;
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
    this.trigger("call:search", 'nearest');
  },

  getTemplate: function() {
    if (this.narrowSearch) {
      return JST['templates/narrow-search'];
    } else {
      return JST['templates/search-template'];
    }
  }
});
