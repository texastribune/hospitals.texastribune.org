app.Views.Search = Marionette.ItemView.extend({
  template: JST['templates/search-template'],
  className: 'search-box',

  ui: {
    'input'        : '#search-content',
    'errorMessage' : '.error',
    'emptyMessage' : '.empty',
    'loading'      : '.loading'
  },

  events: {
    'click #find-me': 'nearestHospitals',
    'click input': 'hideError',
    'submit form': 'submit',
    'click #search-submit': 'submit',
    'click #view-all': 'listHospitals'
  },

  initialize: function(options) {
    if (options) {
      this.narrowSearch = options.narrowSearch;
    }
    this.on('search:completed', this.cleanView);
  },

  submit: function(event){
    event.preventDefault();
    var cad = $.trim(this.ui.input.val()).toLowerCase();
    this.cleanView();
    if (cad === ''){
      // TODO: find a better message
      this.showError('Please type a Zipcode or a Hospital Name');
    } else {
      this.trigger("call:search", cad);
    }
  },

  cleanView: function() {
    if (typeof this.el.length !== 'undefined') {
      this.hideLoading();
      this.hideEmpty();
    }
  },

  showLoading: function() {
    this.ui.loading.show();
  },

  hideLoading: function() {
    this.ui.loading.hide();
  },

  showError: function(text){
    this.ui.errorMessage.html(text).show();
  },

  hideError: function(){
    this.ui.errorMessage.hide();
  },

  showEmpty: function(){
    this.ui.emptyMessage.show();
  },

  hideEmpty: function(){
    this.ui.emptyMessage.hide();
  },

  nearestHospitals: function(event){
    event.preventDefault();
    this.showLoading();
    this.hideError();
    this.hideEmpty();
    this.trigger("call:search", 'nearest');
  },

  listHospitals: function(event){
    event.preventDefault();
    this.trigger('list:hospitals', 'list');
  }
});
