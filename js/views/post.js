define([
  'jquery',
  'underscore',
  'backbone',
  'models/post',
  'collections/post',
  'jquery.loadgist'
], function($, _, Backbone, PostModel, postCollection) {

  var PostView = Backbone.View.extend({
    el: '#post',
    collection: postCollection,
    template: _.template($('#content-template').html()),

    render: function(title) {
      this.$el.siblings().removeClass('active');
      this.$el.addClass('active');
      
      if (this.collection.length > 0) {
        var model = this.collection.findWhere({permalink: title});
        if (model) {
          var data = model.toJSON();
          var self = this;
          
          if (model.get('content') === '') {
            data.content = 'loading...';
            model.fetch({
              dataType: 'html',
              success: function(model) {
                self.$el.find('.post-content').html(model.get('content')).loadGist();
              }
            });
          }
          
          this.$el.html(this.template(data)).loadGist();
          
        } else {
          this.$el.html('sorry, but the post not exist!');
        }
      } else { 
        this.$el.html('config.json not exsit or data format error!');
      }
      
      return this;
    }
  });

  return new PostView();
})
