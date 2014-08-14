require.config({

  paths: {
    'jquery': [
      'http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min',
      'vendor/jquery-2.1.1.min'
    ],
    'underscore': [
      'http://cdn.staticfile.org/underscore.js/1.6.0/underscore-min',
      'vendor/underscore-1.6.0.min'
    ],
    'backbone': [
      'http://cdn.staticfile.org/backbone.js/1.1.2/backbone-min',
      'vendor/backbone-1.1.2.min'
    ],
    'marked': 'vendor/marked-0.3.2.min',
    'jquery.loadgist': 'vendor/jquery.loadgist',
    'text': 'vendor/text'
  },

  shim: {
    'jquery.pjax': ['jquery'],
    'jquery.loadgist': ['jquery']
  }

});

require([
  'app'
], function(App){

  App.initialize();

});
