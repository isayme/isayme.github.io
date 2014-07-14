define([
  'jquery',
  'underscore',
  'backbone',
  '../models/postCollection'
], function($, _, Backbone, postCollection) {

  var IndexView = Backbone.View.extend({
    el: '#content',
    collection: postCollection,
    template: _.template($('#content-template').html()),

    initialize: function() {
      //this.listenTo(this.collection, 'add', this.addPost);
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'error', this.renderError);
    },

    render: function() {
      var self = this;
      this.$el.html('');
      this.collection.forEach(function(model) {
        self.$el.append(self.template(model.toJSON()));
      })
    },

    renderError: function() {
      this.$el.html('config.json not exsit or data format error!');
    },

    addPost: function(model) {
      this.$el.append(this.template(model.toJSON()));
    }
  });

  return new IndexView();
})
