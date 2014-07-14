define([
  'jquery',
  'underscore',
  'backbone',
  'marked'
], function($, _, Backbone, marked) {

  var PostModel = Backbone.Model.extend({
    defaults: {
      title: 'POST NOT EXIST',
      permalink: '404',
      content: '',
      date: ''
    },

    url: function() {
      return '/posts/' + this.get('permalink') + '.md';
    },

    initialize: function() {
      //this.on('change:content', this.contentToMarkdown);
    },

    parse: function(resp) {
      //console.log('sdsa:' + marked(resp));
      if (typeof resp === 'string') {
        return {content: marked(resp)};
      } else {
        return resp;
      }

    },

    contentToMarkdown: function(model, content) {
      model.set('content', marked(content), {silent: true});
    }
  });

  return PostModel;
})
