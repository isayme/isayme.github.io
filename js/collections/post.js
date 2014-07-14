define([
  'jquery',
  'underscore',
  'backbone',
  'models/post'
], function($, _, Backbone, PostModel) {

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,
    url: 'config.json'
  });

  return new PostCollection();

})
