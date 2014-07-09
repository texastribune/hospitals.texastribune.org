app.Views.Hospital = Marionette.ItemView.extend({
  template: JST['templates/hospital-box'],
  tagName: 'div',
  className: 'hospital-box',

  ui: {
    'checkbox': '.hospital-selector',
    'hospitalName': 'header h4.mobile'
  },

  events: {
    'click @ui.hospitalName': 'hospitalClicked',
    'click @ui.checkbox' : 'hospitalSelected'
  },

  templateHelpers: function(){
    var showDistance = this.model.hasDistance(),
        hasEmergencyServices = this.model.get('emergency_services') === 'Yes',
        linkToMap;

    linkToMap = function(address, city, zipcode) {
      var fullAddress = address + ', ' + city + ', TX ' + zipcode;
      return "http://maps.google.com/maps?q=" + encodeURIComponent(fullAddress);
    };

    return {
      linkToMap: linkToMap,
      showDistance: showDistance,
      hasEmergencyServices: hasEmergencyServices
    };
  },

  hospitalSelected: function(){
    this.trigger('select:hospital');
    if (this.ui.checkbox.is(':checked')) {
      this.trigger('checked:hospital', this.model.get('id'));
      this.$el.addClass('active');
    } else {
      this.trigger('unchecked:hospital', this.model.get('id'));
      this.$el.removeClass('active');
    }
  },

  hospitalClicked: function() {
    if (this.ui.checkbox.is(':checked')) {
      this.ui.checkbox.prop('checked', false);
    } else {
      this.ui.checkbox.prop('checked', true);
    }
    this.hospitalSelected();
  }
});
