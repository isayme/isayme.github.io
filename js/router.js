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
      this.postCollection.fetch({parse: false});
    },

    index: function() {
      console.log('[router] index');
      require([
        'views/index'
      ], function(indexView) {
        indexView.render();
      });
    },

    post: function(title) {
      console.log('[router] post: ' + title);
      
      var model = this.postCollection.find({permalink: title});
      if (model) {
        require([
          'views/post'
        ], function(postView) {
          postView.model.set(model.toJSON());
          postView.render();
        });
      }
      
      
    },

    defAction: function(permalink) {
      console.log('[router] 404: ' + permalink);
    }
  });

  return new Router();

})
