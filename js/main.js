$(function(){
  var PostModel = Backbone.Model.extend({
    defaults: {
      title: 'default title',
      permalink: '404',
      content: '',
      date: ''
    },
    
    initialize: function() {
      this.url = '_posts/' + this.get('permalink') + '.md';
    }
  });
  
  var PostCollection = Backbone.Collection.extend({
    model: PostModel,
    url: 'config.json'
  });
  
  var AppView = Backbone.View.extend({
    template: _.template($('#content-template').html()),
    
    initialize: function() {
      _.bindAll(this, 'updateView', 'configError');
    
      this.posts = new PostCollection();
      this.posts.fetch({
        dataType: 'json',
        reset: true,
        success: this.updateView,
        error: this.configError
      });
      
      this.loadingMessage = '';
      this.indexHtml = '';
    },
    
    configError: function() {
      this.$el.hide();
      this.$el.html('config.json not exsit or data format error!');
      this.$el.fadeIn();
    },

    updateView: function() {
      this.packIndex();
      
      if (this.curRoute) {
        this.curRoute[0].apply(this, this.curRoute.slice(1));
      }
    },
    
    packIndex: function() {
      var self = this;
      var content = '';
      
      this.posts.forEach(function(model) {
        content = content + self.template(model.toJSON());
      });
      
      this.indexHtml = content;
    },
    
    showIndex: function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.showIndex);
      this.curRoute = args;
      
      this.$el.hide();
      this.$el.html(this.indexHtml ? this.indexHtml : this.loadingMessage);
      this.$el.fadeIn();
    },
    
    showPost: function(permalink) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.showPost);
      this.curRoute = args;
      
      var self = this;
      var model = this.posts.findWhere({permalink: permalink});

      if (model) {
        if (model.get('content') !== '') {
          this.$el.hide();
          this.$el.html(this.template(model.toJSON()));
          this.$el.fadeIn();
          return this;
        }
        this.$el.html(this.loadingMessage);
        model.fetch({
          dataType: 'html',
          success: function(model, resp) {
            model.set('content', marked(resp));
            self.$el.hide();
            self.$el.html(self.template(model.toJSON()));
            self.$el.fadeIn();
          },
          error: function() {
            self.$el.hide();
            self.$el.html('page not exsit!');
            self.$el.fadeIn();
          }
        });
      }
      return this;
    },
      
    showError: function(permalink) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.showError);
      this.curRoute = args;
      
      this.$el.hide();
      this.$el.html(permalink);
      this.$el.fadeIn();
    }
  });
  
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':title.html': 'post',
      '*defAction': 'defAction'
    },

    initialize: function() {
      this.app = new AppView({el: $('#content')});
    },
    
    index: function() {
      this.app.showIndex();
    },

    post: function(title) {
      this.app.showPost(title);
    },

    defAction: function(permalink) {
      this.app.showError(permalink);
    }
  });

  var router = new Router();

  Backbone.history.start();
  
});
