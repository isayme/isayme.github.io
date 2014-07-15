define([
  'jquery',
  'underscore',
  'backbone',
  'models/post'
], function($, _, Backbone, PostModel) {

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,
    url: function() {
      return 'config.json';
    }
  });

  return new PostCollection();

})
