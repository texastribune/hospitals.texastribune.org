app.Views.CompareView = Marionette.CollectionView.extend({
  template: JST['templates/compare'],

  triggers: {
    'click a.compare': 'select:hospitals'
  },

  templateHelpers: function() {
    var minuteOrNA,
        percentOrNA;

    minuteOrNA = function(value) {
      if (value === null || value === undefined || value === '') {
        return 'N/A';
      } else {
        return value + ' min.';
      }
    };

    percentOrNA = function(value) {
      if (value === null || value === undefined || value === '') {
        return 'N/A';
      } else {
        return value + '%';
      }
    };

    return {
      'minuteOrNA': minuteOrNA,
      'percentOrNA': percentOrNA
    };
  },

  appendHtml: function(collectionView, itemView, index) {
  },

  render: function(something) {
    var template = this.getTemplate(),
        data,
        html;

    data = this.collection.map(function (model) {
      return model.toJSON();
    });

    html = template(_.extend({children: data}, this.templateHelpers()));
    this.$el.empty();
    this.$el.append(html);

    return this;
  }
});