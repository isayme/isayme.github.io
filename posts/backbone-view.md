```
  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  // `Bacbone.View`定义.
  var View = Backbone.View = function(options) {
    // 每个view都存在一个`cid`标识(值唯一).
    this.cid = _.uniqueId('view');
    options || (options = {});
    // 利用underscore的`pick`函数从`options`中extend `viewOptions`指定的参数.
    _.extend(this, _.pick(options, viewOptions));
    // 确保当前view是有效的, 具体实现看`_ensureElement`的注释.
    this._ensureElement();
    // 调用初始化函数`initialize`.
    this.initialize.apply(this, arguments);
    // 绑定DOM事件(这里的事件绑定和Backbone自身的Events不同, 而是利用jQuery实现).
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  // 正则表达式, 用于事件绑定函数`delegateEvents`.
  // 此正则表达式匹配**以空格分割的字符串**, 如"click #id.post".
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  // 此变量使用见上面的构造函数, view在new时可以提供参数, 
  // 而Backbone只会提取`viewOptions`中指定的参数, 其他的会忽略.
  // model: view对应的model**对象**;
  // collection: view对应的collection**对象**;
  // el: 直接指定view对应的DOM, 可能的形式是: $('#id') 或 '#id' (Backbone会兼容这两种值);
  // id: view所在DOM的`id`属性;
  // attributes: DOM对象的属性配置, 如`input`标签的`type`, `img`标签的`src`, 
  //            甚至`class`等也可以在这里设置而不用`className`;
  // className: view所在DOM的`class`属性;
  // tagName: view对应的DOM标签tag, 默认是`div`;
  // events: 需要绑定的事件信息.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  // extend`View`的`prototype`.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    // 上面说过, 默认`tagName`的值是`'div'`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    // 为view对象提供$函数(利用jQuery的find接口).
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    // 默认的初始化函数.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    // 默认的render函数, 实际使用中这个函数用于渲染view实例对应的界面.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    // 销毁函数.
    remove: function() {
      // 删除DOM元素.
      this.$el.remove();
      // 取消绑定的事件.
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    // 改变view对应的DOM. 默认会重新绑定事件.
    setElement: function(element, delegate) {
      // 如果之前的DOM已经存在, 则解绑之前的事件.
      if (this.$el) this.undelegateEvents();
      // 根据`element`的类型改变`$el`对象, 注意最终`$el`是一个jQuery对象.
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      // `el`变量是一个DOM元素(类型与getElementById的返回值, 具体可以参见jQuery对象的格式).
      this.el = this.$el[0];
      // 如果没有特别说明, 重新绑定事件到新DOM元素.
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    // 绑定事件的实现, `events`的参数格式参见上面的英文注释.
    delegateEvents: function(events) {
      // 这里有个underscore的`result`的调用, Backbone中存在很多这样的调用, 这里举例解释下`result`的好处:
      // 默认情况, 如果`'event'`对象就是普通的Object对象, 则直接返回;
      // 特殊情况是如果`'event'`是一个函数, `result`函数就会将函数的执行结果返回!
      if (!(events || (events = _.result(this, 'events')))) return this;
      
      // 事件绑定前线解绑之前已绑定的事件.
      this.undelegateEvents();
      // 遍历`events`对象.
      for (var key in events) {
        // 获取一个事件配置.
        var method = events[key];
        // 从函数开头的注释中可以看出, 事件的回调本应该是一个函数, 但Backbone同样允许你给一个字符串.
        // 因为这里会检测, 如果是字符串, 就以当前对象中以指定字符串为索引的对象为毁掉函数.
        if (!_.isFunction(method)) method = this[events[key]];
        // 上面的操作后发现回调函数不存在, 直接跳过.
        if (!method) continue;

        // 正则匹配事件配置信息.
        // 举例: 'mousedown .title':  'edit'
        // 这里的key就是上面的'mousedown .title'
        var match = key.match(delegateEventSplitter);
        // `match[1]`就是上面的'mousedown';
        // `match[2]`就是上面的'.title';
        var eventName = match[1], selector = match[2];
        // 利用underscore的`bind`函数指定回调函数的上下文`context`为当前view(这里的`this`);
        method = _.bind(method, this);
        // 每个事件都加一个`'.delegateEvents' + this.cid`后缀, 即`namespaces`概念, 这样在事件解绑的时候很方便.
        // 这是jQuery的特性, 具体参见jQeury的`on`函数.
        eventName += '.delegateEvents' + this.cid;
        // `selector`为空时表示事件是针对当前view.
        // 否则就是针对当前view的子元素(子DOM).
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    // 事件解绑函数, 注意这里的实现. 
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    // 根据配置设置元素的值.
    _ensureElement: function() {
      // 如果已经指定`el`属性, 则当前view的DOM根据`el`属性获取;
      // 否则根据其他诸如`id`, `className`, `tagName`获取;
      if (!this.el) {
        // 获取DOM的属性配置.
        var attrs = _.extend({}, _.result(this, 'attributes'));
        // 如果设置了`id`, 则将`id`值添加到DOM属性配置对象中.
        if (this.id) attrs.id = _.result(this, 'id');
        // 如果设置了`className`, 则将`className`值添加到DOM属性配置对象中.
        if (this.className) attrs['class'] = _.result(this, 'className');
        // 新建DOM对象, 并设置属性.
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        // 设置新建的jQuery对象至当前view.
        this.setElement($el, false);
      } else {
        // 根据`el`信息设置当前view的DOM信息.
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });
```
