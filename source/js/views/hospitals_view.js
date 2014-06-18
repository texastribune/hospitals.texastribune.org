'use strict';

app.Views.Hospitals = Marionette.CompositeView.extend({
  template: JST['templates/hospitals'],
  itemView: app.Views.Hospital,

  templateHelpers: function(){
    var showResults = (this.collection.length > 0),
        showDistance = false;

    if (showResults) {
      showDistance = this.collection.at(0).hasDistance();
    }

    return {
      showResults: showResults,
      showDistance: showDistance
    };
  },

  itemEvents: {
    'checked:hospital': 'hospitalChecked',
    'unchecked:hospital': 'hospitalUnchecked'
  },

  triggers: {
    'click a.more-results': 'more-results:hospitals'
  },

  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);
  },

  hospitalChecked: function(eventName, itemView, una) {
    this.trigger('hospital:selected', itemView.model.id);
  },

  hospitalUnchecked: function(eventName, itemView) {
    this.trigger('hospital:deselected', itemView.model.id);
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },

  disableSelection: function() {
    $('.hospital-selector:not(:checked)').attr('disabled', 'disabled');
  },

  enableSelection: function() {
    $('.hospital-selector').removeAttr('disabled');
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
