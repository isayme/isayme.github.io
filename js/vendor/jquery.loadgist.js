;(function($) {

  // plugin name
  var pluginName = 'loadGist';

  // reserved for later update
  var defaults = {};

  // catch for <head>
  var $head = $('head');

  // load css if not exist
  function loadCSS(src) {
    if ($head.find('link[rel="stylesheet"][href="' + src + '"]').length < 1) {
      $head.append('<link rel="stylesheet" href="'+ src +'">');
    }
  }

  $.fn[pluginName] = function(options) {
    options = $.extend({}, defaults, options);

    // find embed gists
    var $gists = this.find('script[src^="https://gist.github.com/"]');

    return $gists.each(function() {
      var $this = $(this);
      // make json request url
      var src = $this.attr('src') + 'on?callback=?';

      $.getJSON(src, function(data) {
        $this.replaceWith(data.div);
        loadCSS(data.stylesheet);
      }).fail(function() {
        var gist = $this.attr('src').substring(0, $this.attr('src').length - 3);
        $this.replaceWith('<a href="' + gist + '">' + gist+ '</a>');
      });
    });
  };

  $.fn[pluginName].defaults = defaults;

})(jQuery);
