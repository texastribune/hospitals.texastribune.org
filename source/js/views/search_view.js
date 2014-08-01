app.Views.Search = Marionette.ItemView.extend({
  template: JST['templates/search-template'],
  className: 'search-box',

  ui: {
    input: '#search-content',
    error: '.error',
    empty: '.empty',
    loading: '.loading'
  },

  events: {
    'click #find-me': 'nearestHospitals',
    'click input': 'hideError',
    'submit form': 'submit',
    'click #search-submit': 'submit'
  },

  initialize: function(options) {
    if (options) {
      this.narrowSearch = options.narrowSearch;
    }
    this.on('search:completed', this.cleanView);
  },

  submit: function(event){
    event.preventDefault();
    var cad = this.ui.input.val().trim().toLowerCase();
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
    this.ui.error.html(text).show();
  },

  hideError: function(){
    this.ui.error.hide();
  },

  showEmpty: function(){
    this.ui.empty.show();
  },

  hideEmpty: function(){
    this.ui.empty.hide();
  },

  nearestHospitals: function(event){
    event.preventDefault();
    this.showLoading();
    this.hideError();
    this.hideEmpty();
    this.trigger("call:search", 'nearest');
  }
});
