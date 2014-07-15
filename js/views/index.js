define([
  'jquery',
  'underscore',
  'backbone',
  'collections/post'
], function($, _, Backbone, postCollection) {

  var IndexView = Backbone.View.extend({
    el: '#content',
    collection: postCollection,
    template: _.template($('#content-template').html()),

    render: function() {
      var self = this;
      if (this.collection.length > 0) {
        this.$el.html('');
        this.collection.forEach(function(model) {
          var data = model.toJSON();
          data.content = '';
          self.$el.append(self.template(data));
        });
      } else {
        this.$el.html('config.json not exsit or data format error!');
      }
      
      return this;
    }
  });

  return new IndexView();
})
