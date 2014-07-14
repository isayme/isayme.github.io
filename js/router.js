define([
  'jquery',
  'underscore',
  'backbone',
  'models/postCollection'
], function($, _, Backbone, postCollection) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':title.html': 'post',
      '*defAction': 'defAction'
    },

    initialize: function() {
      this.postCollection = postCollection;
      this.postCollection.fetch();
    },

    index: function() {
      console.log('[router] index');
      require([
        'views/indexView'
      ], function(indexView) {
        indexView.render();
      });
    },

    post: function(title) {
      console.log('[router] post: ' + title);
      require([
        'views/postView'
      ], function(postView) {
        postView.model.set('permalink', title);
      });
    },

    defAction: function(permalink) {
      console.log('[router] 404: ' + permalink);
    }
  });

  return new Router();

})
