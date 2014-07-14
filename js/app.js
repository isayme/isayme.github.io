define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'bootstrap'
], function($, _, Backbone, router) {

  var App = {
    initialize: function() {
      var welcome = '\n' +
          '     **   ********\n' + 
          '    //   **//////\n' + 
          '     ** /**          ******     **   **  **********    *****\n' +
          '    /** /*********  //////**   //** **  //**//**//**  **///**\n' +
          '    /** ////////**   *******    //***    /** /** /** /*******\n' +
          '    /**        /**  **////**    /**      /** /** /** /**////\n' +
          '    /**  ********  //********   **       *** /** /** //******\n' +
          '    //  ////////    ////////   **       ///  //  //   //////\n' +
          '                              //\n\n';
      
      console.log(welcome);
      
      Backbone.history.start();
    }
  };

  return App;

});
