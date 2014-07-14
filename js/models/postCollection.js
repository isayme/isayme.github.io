define([
  'jquery',
  'underscore',
  'backbone',
  './postModel'
], function($, _, Backbone, PostModel) {

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,
    url: 'config.json'
  });

  return new PostCollection();

})
