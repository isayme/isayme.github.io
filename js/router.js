define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':title.html': 'post',
      '*defAction': 'defAction'
    },

    index: function() {
      require([
        'views/index'
      ], function(indexView) {
        indexView.render();
      });
    },

    post: function(title) {
      require([
        'views/index'
      ], function(indexView) {
        indexView.render(title);
      });
    },

    defAction: function(permalink) {
      console.log('[router] 404: ' + permalink);
    }
  });

  return new Router();

})
