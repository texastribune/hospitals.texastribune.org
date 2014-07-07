'use strict';

app.Views.CompareView = Marionette.CollectionView.extend({
  template: JST['templates/compare'],

  triggers: {
    'click a.compare': 'select:hospitals'
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

    html = template({ children: data});
    this.$el.empty();
    this.$el.append(html);

    return this;
  }
});