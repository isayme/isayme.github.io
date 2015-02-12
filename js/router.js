define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var Router = Backbone.Router.extend({
    routes: {
      '(!/)': 'index',
      '(!/):title.html': 'post',
      '*defAction': 'defAction'
    },

    index: function() {
      var self = this;
      require([
        'views/index'
      ], function(indexView) {
        indexView.render();
        self.reloadDisqus();
      });
    },

    post: function(title) {
      var self = this;
      require([
        'views/index'
      ], function(indexView) {
        indexView.render(title);
        self.reloadDisqus(title);
      });
    },

    defAction: function(permalink) {
      console.log('[router] 404: ' + permalink);
    },

    reloadDisqus: function(identifier) {
      window.disqus_identifier = identifier;

      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = window.disqus_identifier;
          }
        });
      } else {
        (function() {
          var disqus_shortname = 'cainixiangbudao';
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
      }
    }
  });

  return new Router();

})
