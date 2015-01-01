define([
  'jquery',
  'underscore',
  'backbone',
  'marked'
], function($, _, Backbone, marked) {

  marked.setOptions({breaks: true});
  
  var PostModel = Backbone.Model.extend({
    defaults: {
      title: '',
      permalink: '',
      content: '',
      date: ''
    },

    url: function() {
      return '/posts/' + this.get('permalink') + '.md';
    },

    parse: function(resp) {
      return {content: marked(resp)};
    },

    contentToMarkdown: function(model, content) {
      model.set('content', marked(content), {silent: true});
    }
  });

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,
    url: function() {
      return 'config.json';
    }
  });

  return new PostCollection();

})
