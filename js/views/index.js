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
    permalink: null,
    
    initialize: function() {
      this.collection.fetch({
        parse: false,
        success: _.bind(this.update, this),
        error: _.bind(this.update, this)
      });
    },
    
    update: function() {
      if (this.collection.length <= 0) {
        this.$el.html('config.json not exsit or data format error!');
      }
      
      this.render(this.permalink);
    },
    
    render: function(permalink) {
      var self = this;
      this.permalink = permalink;
      
      if (this.collection.length <= 0) {
        return this;
      }
      
      if (permalink) {  // post detail   
        var model = this.collection.findWhere({permalink: permalink});
        if (model) {
          var data = model.toJSON();
          
          require([
            'jquery.loadgist'
          ], function() {
            if (model.get('content') === '') {
              data.content = '<div style="margin-left: auto; margin-right: auto; width: 64px; height: 64px"><img src="img/loading-spinning-bubbles.svg"/></div>';
              model.fetch({
                dataType: 'html',
                success: function(model) {
                  if (self.permalink === permalink) {
                    self.$el.find('.post-content').html(model.get('content')).loadGist();
                  }
                }
              });
            }
            self.$el.html(self.template(data)).loadGist();
            self.$el.find('.post-content').show();
          });
          
          document.title = model.get('title');
        } else {
          this.$el.html('sorry, but the post not exist!');
          document.title = '404';
        }
      } else {  // post list
        this.$el.html('');
        this.collection.forEach(function(model) {
          var data = model.toJSON();
          self.$el.append(self.template(data));
        });
        
        document.title = 'H E A V E N';
      }
    }
  });

  return new IndexView();
})
