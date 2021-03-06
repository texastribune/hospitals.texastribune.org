app.Views.HospitalsToCompare = Marionette.CompositeView.extend({
  template: JST['templates/hospitals-to-compare'],
  itemView: app.Views.HospitalToCompare,
  className: 'glossary content-block',

  itemEvents: {
    "remove:hospital": 'removeHospitalClicked'
  },

  ui: {
    'compare': '.compare'
  },

  events: {
    'click @ui.compare': 'compare',
    'click #view-all': 'listHospitals'
  },

  onAfterItemAdded: function(itemView) {
    this.isReadyToCompare();
  },

  onItemRemoved: function(itemView){
    this.isReadyToCompare();
  },

  appendHtml: function(collectionView, itemView){
    if (collectionView.$('.active-hospitals').length === 0) {
      collectionView.$el.append(this.template());
    }
    collectionView.$('.active-hospitals').append(itemView.el);
  },

  compare: function(event) {
    event.preventDefault();

    this.trigger('compare:hospitals', this.collection.pluck('_id'));
  },

  removeHospitalClicked: function(eventName, itemView, hospitalId) {
    this.collection.remove(itemView.model);
    this.trigger('remove:hospital', itemView.model);
  },

  isReadyToCompare: function() {
    if (this.collection.length > 1) {
      this.enableCompareButton();
      this.trigger('readyToCompare:hospitals');
    } else {
      this.disableCompareButton();
      this.trigger('notReadyToCompare:hospitals');
    }
  },

  listHospitals: function(event){
+   event.preventDefault();
+   this.trigger('list:hospitals', 'list');
  },

  enableCompareButton: function() {
    this.ui.compare.prop('disabled', false);
  },

  disableCompareButton: function() {
    this.ui.compare.prop('disabled', true);
  },
});
