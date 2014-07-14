define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'bootstrap'
], function($, _, Backbone, router) {

  var App = {
    initialize: function() {
      Backbone.history.start();
    }
  };

  return App;

});
