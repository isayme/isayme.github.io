define([
  'jquery',
  'underscore',
  'backbone',
  'marked'
], function($, _, Backbone, marked) {

  var PostModel = Backbone.Model.extend({
    defaults: {
      title: '',
      permalink: '',
      content: '',
      date: ''
    },

    url: function() {
      return '/posts/' + this.get('permalink') + '.md' + '?id=' + Math.random();
    },

    initialize: function() {
      // this.on('change:content', this.contentToMarkdown);
    },

    parse: function(resp) {
      return {content: marked(resp)};
    },

    contentToMarkdown: function(model, content) {
      model.set('content', marked(content), {silent: true});
    }
  });

