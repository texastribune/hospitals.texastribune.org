'use strict';

app.Views.CompareView = Marionette.CollectionView.extend({
  template: JST['templates/compare'],

  triggers: {
    'click .select': 'select:hospitals'
  },

  templateHelpers: function() {
    var minuteOrNA = function(value) {
      if (value === null || value === undefined || value === '') {
        return 'N/A';
      } else {
        return value + ' min.';
      }
    }
    return {
      'minuteOrNA': minuteOrNA
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