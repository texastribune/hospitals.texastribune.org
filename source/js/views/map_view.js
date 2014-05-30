"use strict";

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
