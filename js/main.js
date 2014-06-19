$(function(){
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':title.html': 'post',
      '*defAction': 'defAction'
    },

    index: function() {
      console.log('index');
    },

    post: function(title) {
      console.log(title);
    },

    defAction: function() {
      console.log('404');
    }
  });

  var router = new Router();

  Backbone.history.start();
  
});
