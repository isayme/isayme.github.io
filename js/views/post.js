define([
  'jquery',
  'underscore',
  'backbone',
  'models/post',
  'collections/post'
], function($, _, Backbone, PostModel, postCollection) {

  var PostView = Backbone.View.extend({
    el: '#content',
    collection: postCollection,
    template: _.template($('#content-template').html()),

    render: function() {
      if (this.collection.length > 0) {
        this.$el.html(this.template(this.model.toJSON()));
      } else {
        this.$el.html('loading ...');
      }
    },

    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.collection, 'sync', this.syncCollection);
      this.listenTo(this.model, 'change:permalink', this.reFetch)
    },

    syncCollection: function() {
      console.log('syncCollection;' + this.model.get('permalink'));

      var pModel = this.collection.findWhere({permalink: this.model.get('permalink')});
      if (pModel) {
        this.model.set(model.toJSON(), {silent: true});
        this.model.fetch({dataType: 'html'});
      } else {
        this.model.clear({silent: true});
        this.model.trigger('sync');
      }
    },

    reFetch: function(model, permalink) {
      console.log('pst view;' + permalink);
      if (this.collection.length) {
        var pModel = this.collection.findWhere({permalink: permalink});
        if (pModel) {
          this.model.set(pModel.toJSON(), {silent: true});
          this.model.fetch({dataType: 'html'});
        } else {
          this.model.clear({silent: true});
          this.model.trigger('sync');
        }
      }
    }
  });

  return new PostView({model: new PostModel()});
})
