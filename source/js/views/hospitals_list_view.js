app.Views.HospitalsList = Marionette.CompositeView.extend({
  template: JST['templates/hospitals-list'],
  itemView: app.Views.HospitalListed,
  itemViewContainer: 'tbody',

  onShow: function() {
    var $hospitalList = $("#hospital-list-all");
    var $toggle = $('.toggle');
    var $alpha = $('.alpha');
    var $emailHospital = $('#email-hospital');

    $hospitalList.tablesorter({
      sortList: [[1, 0]],
      widthFixed : false,
      widgets: ["filter"],

      widgetOptions : {
        filter_external : '.table-search',
        filter_columnFilters: false,
        filter_saveFilters : true,
        filter_reset: '.reset',
      }
    });



    // $toggle.on('click', function(){
    //   if ($toggle.hasClass('alpha-hide')){
    //     $toggle.removeClass('alpha-hide').addClass('alpha-show');
    //   } else {
    //     $toggle.addClass('alpha-hide').removeClass('alpha-show');
    //   }
    // });
  }
});
