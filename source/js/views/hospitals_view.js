app.Views.Hospitals = Marionette.CompositeView.extend({
  template: JST['templates/hospital-boxes'],
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
    collectionView.$(".hospital-boxes").append(itemView.el);
  },

  disableSelection: function() {
    $('.hospital-selector:not(:checked)').attr('disabled', 'disabled');
  },

  enableSelection: function() {
    $('.hospital-selector').removeAttr('disabled');
  },

  checkHospitals: function(hospitals) {
    var self = this,
        hospitalId;

    hospitals.each(function(hospital) {
      hospitalId = hospital.id;
      if (self.collection.get(hospitalId)) {
        self.check(hospitalId);
      }
    });
  },

  check: function(id) {
    var $checkbox = this.$el.find('*[data-id="' + id +'"]');

    $checkbox.prop('checked', true);
    $checkbox.parents('.hospital-box').addClass('active');
  },

  uncheck: function(id) {
    var $checkbox = this.$el.find('*[data-id="' + id +'"]');

    $checkbox.prop('checked', false);
    $checkbox.parents('.hospital-box').removeClass('active');
  }
});
