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
      this.$el.removeClass('loading');

      if (this.collection.length <= 0) {
        this.$el.addClass('warning');
        this.$el.html('NO `config.json` EXSIT OR DATA FORMAT ERROR!');
      } else {
        this.render(this.permalink);
      }
    },
    
    render: function(permalink) {
      var self = this;
      this.permalink = permalink;
      if (this.collection.length <= 0) return;
      
      // post list
      if (!permalink) {
        document.title = 'H E A V E N';
        this.$el.removeClass('warning');
        this.$el.html('');
        this.collection.forEach(function(model) {
          var data = model.toJSON();
          self.$el.append(self.template(data));
        });
        return;
      }

      var model = this.collection.findWhere({permalink: permalink});
      if (!model) {
        document.title = 'o(╯□╰)o';
        this.$el.addClass('warning');
        this.$el.html('SORRY, BUT THE POST NOT EXIST!');
        return;
      }

      document.title = model.get('title');
      var data = model.toJSON();
      data.content = '';
      this.$el.html(self.template(data));
      this.$el.find('.post-content').addClass('loading').show();

      require(['then'], function(Then) {
        var promise = new Then(function(resolve, reject) {
          if (model.get('content') === '') {
            model.fetch({
              dataType: 'html',
              success: function(model) {
                if (self.permalink === permalink) {
                  resolve(model.get('content'));
                } else {
                  // route changed
                  reject(null);
                }
              },
              error: function() {
                reject('SORRY, BUT WE FAILED TO FETCH THE POST CONTENT!');
              }
            });
          } else {
            resolve(model.get('content'));
          }
        });

        promise.then(function(value) {
          self.$el.find('.post-content').removeClass('loading');
          self.$el.find('.post-content').html(value);
        }, function(reason) {
          self.$el.find('.post-content').removeClass('loading');
          if (reason) {
            self.$el.find('.post-content').addClass('warning');
            self.$el.find('.post-content').html(reason);
          }
        });
      });
    }
  });

  return new IndexView();
})
