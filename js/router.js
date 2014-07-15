define([
  'jquery',
  'underscore',
  'backbone',
  'collections/post'
], function($, _, Backbone, postCollection) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':title.html': 'post',
      '*defAction': 'defAction'
    },

    initialize: function() {
      this.postCollection = postCollection;
      this.postCollection.fetch({parse: false, async: false});
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
        'views/post'
      ], function(postView) {
        postView.render(title);
      });
      
    },

    defAction: function(permalink) {
      console.log('[router] 404: ' + permalink);
    }
  });

  return new Router();

})
