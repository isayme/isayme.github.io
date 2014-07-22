define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var NavView = Backbone.View.extend({
    el: '#menu',
    
    events: {
      'click #menu-show': 'showContent',
      'click #menu-close': 'hideContent',
    },
    
    render: function() {
      return this;
    },
    
    showContent: function() {
      $('#menu-content').addClass('active');
    },
    
    hideContent: function() {
      $('#menu-content').removeClass('active');
    },
  });

  return new NavView();
})
