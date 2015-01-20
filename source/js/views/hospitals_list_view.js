app.Views.HospitalsList = Marionette.CompositeView.extend({
  template: JST['templates/hospitals-list'],
  itemView: app.Views.HospitalListed,
  itemViewContainer: 'tbody',

  onShow: function() {
    var $hospitalList = $("#hospital-list-all");
    var $filter = $('#filter');

    $hospitalList.tablesorter({
      sortList: [[1, 0]],
      widthFixed : false,
      widgets: ["filter"],
    });
  }
});
