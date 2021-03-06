app.Controllers.SelectController = Marionette.Controller.extend({
  initialize: function(options) {
    this.maxHospitals = app.Settings.maxSelected;
    this.searchView  = new app.Views.Search();

    this.searchController = new app.Controllers.SearchController({
      view: this.searchView,
      collection: typeof options.results === 'undefined' ? [] : options.results
    });

    this.hospitalsView = new app.Views.Hospitals({
      collection: this.searchController.collection
    });

    this.mapView = new app.Views.Map({
      collection: this.searchController.collection
    });

    this.hospitalsToCompare = this.getHospitals(options.hospitalIds);

    this.compareTopView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    this.compareBottomView = new app.Views.HospitalsToCompare({
      collection: this.hospitalsToCompare
    });

    this.layout = new app.Layouts.Results();
    app.resultsRegion.show(this.layout);
    this.layout.search.show(this.searchView);

    if (!app.Helpers.isMobile()){
      this.layout.map.show(this.mapView);
    }

    this.layout.list.show(this.hospitalsView);
    this.layout.selectedTop.show(this.compareTopView);
    this.layout.selectedBottom.show(this.compareBottomView);
    this.listenTo(this.hospitalsView, 'more-results:hospitals', this.moreResults);
    this.listenTo(this.hospitalsView, 'hospital:selected', this.selectHospital);
    this.listenTo(this.hospitalsView, 'hospital:deselected', this.deselectHospital);
    this.listenTo(this.hospitalsView, 'render', this.syncronizeViews);
    this.listenTo(this.searchView, 'list:hospitals', this.listHospitals);

    this.preloadList(options);
    this.listenTo(this.compareTopView, 'compare:hospitals', this.compare);
    this.listenTo(this.compareTopView, 'remove:hospital', this.removeHospital);
    this.listenTo(this.compareBottomView, 'compare:hospitals', this.compare);
    this.listenTo(this.compareBottomView, 'remove:hospital', this.removeHospital);
    this.listenTo(this.searchController, 'after:search', this.syncronizeViews);

    this.syncronizeViews();
    $('#explorer-introduction').hide();
    $('#compare').html(''); // INPOT
    $(window).scrollTop(0);
  },

  onClose: function() {
    this.layout.close();
  },

  preloadList: function(options) {
    if (typeof options.searching !== 'undefined') {
      this.searchController.search(options.searching);
      app.mainRouter.navigate('search/' + this.searchController.searching);
    } else {
      this.searchController.search(this.getFirstZipcode());
    }
  },

  listHospitals: function(){
    app.mainRouter.navigate('list');
    this.hospitalsController = new app.Controllers.HospitalsController();
    this.close();
  },

  moreResults: function() {
    this.searchController.moreResults();
  },

  compare: function(ids) {
    app.compareController = new app.Controllers.CompareController(ids);
    this.close();
  },

  selectHospital: function(hospitalId) {
    this.hospitalsToCompare.add(app.hospitals.get(hospitalId));
    this.syncronizeViews();
    this.updateURL();
  },

  deselectHospital: function(hospitalId) {
    this.hospitalsToCompare.remove(app.hospitals.get(hospitalId));
    this.syncronizeViews();
    this.updateURL();
  },

  syncronizeViews: function() {
    this.checkSelectedHospitals();
    this.mapView.checkHospitals(this.hospitalsToCompare);
    this.hospitalsView.updateSearchString(this.searchController.searching);
    if (this.hospitalsToCompare.length >= this.maxHospitals) {
      this.hospitalsView.disableSelection();
    } else {
      this.hospitalsView.enableSelection();
    }
  },

  checkSelectedHospitals: function() {
    this.hospitalsView.checkHospitals(this.hospitalsToCompare);
    this.mapView.checkHospitals(this.hospitalsToCompare);
  },

  removeHospital: function(hospital) {
    this.hospitalsView.uncheck(hospital.id);
    this.mapView.checkHospitals(this.hospitalsToCompare);
    this.syncronizeViews();
    this.updateURL();
  },

  updateURL: function() {
    var ids = this.hospitalsToCompare.map(function(hospital) {
      return hospital.id;
    });
    app.mainRouter.navigate('select/' + ids.join('/'));
  },

  getHospitals: function(hospitalIds) {
    var hospitals = [];
    hospitalIds = typeof hospitalIds === 'undefined' ? [] : hospitalIds;

    _.each(hospitalIds, function(hospitalId) {
      hospitals.push(app.hospitals.get(hospitalId));
    });

    return (new app.Collections.Hospitals(hospitals));
  },

  getFirstZipcode: function() {
    var hospital;

    if (this.hospitalsToCompare && this.hospitalsToCompare.length > 0) {
      hospital = this.hospitalsToCompare.at(0);
      return hospital.get('zipcode');
    } else {
      return '';
    }
  }
});
