app.Views.CompareView = Marionette.CollectionView.extend({
  template: JST['templates/compare'],

  triggers: {
    'click a.compare': 'select:hospitals'
  },

  templateHelpers: function() {
    var minuteOrNA,
        percentOrNA,
        cycleClass,
        linkToMap;

    linkToMap = function(model) {
      var address = model.address + ', ' + model.city + ', TX ' + model.zipcode;
      return "http://maps.google.com/maps?q=" + encodeURIComponent(address);
    };

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
        return value.toFixed(2) + '%';
      }
    };

    cycleClass = function(index) {
      var classesLength = 10,
          indexClass;

      if (index < classesLength) {
        return 'card-' + (index + 1);
      } else {
        index = index + 1;
        indexClass = classesLength - Math.ceil(index / 10.0) * classesLength + index;
        return 'card-' + indexClass;
      }
    };

    return {
      'linkToMap': linkToMap,
      'minuteOrNA': minuteOrNA,
      'percentOrNA': percentOrNA,
      'cycleClass': cycleClass
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