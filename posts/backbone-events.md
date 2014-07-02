```javascript
  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  
  // 这里定义`Backbone.Events`变量.
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    // `on`函数用于绑定一个事件, 事件触发时执行回调函数`callback`.
    // 典型调用方式是`object.on('name', callback, context)`.
    // `name`是监听的事件, `callback`是事件触发时的回调函数, `context`是回调函数上下文(未指定时就默认为`object`).
    // 这里有个特殊的事件`'all'`, 绑定此事件后, 任何非`'all'`事件触发时都会执行`all`事件绑定的回调.
    on: function(name, callback, context) {
      // `callback`为空时直接返回. `eventsApi`调用在后面`eventsApi`的注释中再讨论.
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      // `object`要保存所有监听的事件, 存储在`_events`变量中.
      this._events || (this._events = {});
      // 具体事件的保存是array数组, 以事件名`name`为索引.
      var events = this._events[name] || (this._events[name] = []);
      // 将此次绑定的事件压到数组尾;
      // `callback`即事件触发时的回调函数, `ctx`是回调函数调用时的`context`, 默认为`this`(即`object`);
      // TODO: 这里不理解为什么又要保存另外一个`context`变量.
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    // `once`和`on`的区别是`once`触发一次后就会解绑监听的事件, 即只执行一次.
    once: function(name, callback, context) {
      // 同`on`
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      // 保存`this`.
      var self = this;
      // 调用underscore的`once`函数, 确保回调只执行一次(即使出现多次调也用只会执行一次函数体).
      // 这里其实是对传入的`callback`进行一次wrap.
      var once = _.once(function() {
        // 回调函数执行时, 解绑事件. 注意这里解绑的回调参数是`once`, 因为下面`on`绑定时就是`once`.
        self.off(name, once);
        // 调用callback函数.
        callback.apply(this, arguments);
      });
      // 设置`_callback`变量, 理解这里的用意请看后面对`off`函数的注释.
      once._callback = callback;
      // 调用`on`接口绑定事件.
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    // `off`用于解绑事件.
    // `name`, `callback`, `context`三个参数都是可选的, 参数未指定时则匹配所有.
    // 典型应用是`object.off('name' callback, context);`.
    off: function(name, callback, context) {
      // 定义一堆变量后面要用.
      var retain, ev, events, names, i, l, j, k;
      // 当前`object`不存在`_events`(即没有绑定过事件)直接返回, `eventsApi`调用暂不讨论.
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      // 如果`name`, `callback`, `context`都为指定, 则删除所有已经绑定的事件.
      if (!name && !callback && !context) {
        // 这里`void 0`等价于`undefined`, 即`this._events = undefined;`.
        this._events = void 0;
        return this;
      }
      // 如果`name`未指定, 默认是针对所有已绑定的事件类型.
      names = name ? [name] : _.keys(this._events);
      // 遍历.
      for (i = 0, l = names.length; i < l; i++) {
        // 获取事件名称.
        name = names[i];
        // 获取保存此事件的数组对象, 不为空时继续处理.
        if (events = this._events[name]) {
          // 直接将事件数组清空. 这里的思想是: 先清空, 然后将不满足条件的再加进来.
          this._events[name] = retain = [];
          // `callback`和`context`参数都不存在时即删除当前事件类型下的所有已绑定的`callback`.
          // 任意一个不为空, 继续处理.
          if (callback || context) {
            // 遍历数组.
            for (j = 0, k = events.length; j < k; j++) {
              // 获取数组中的一个对象.
              ev = events[j];
              // 如果`ev.callback`与参数`callback`不同或`ev.context`与参数`context`不同, 说明此事件不需要删除.
              // 注意这里有个`callback !== ev.callback._callback`;
              // 回想上面的`once`函数, 里面最终绑定的`callback`不是我们调用时传入的那个`callback`,
              // 而是通过underscore的`once`函数包裹后的;
              // 即`obj.once(name, callback1)`实际`on`绑定的是包裹成的`callback2`, 且`callback2._callback = callback1;`;
              // 所以, `once`函数中的`once._callback = callback;`语句是为了我们同样可以`off`解绑`once`绑定的事件!
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          
          // 如果改事件类型变量数组为空, 直接在this._events中删除此事件对应的数组.
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    // 触发事件name.
    // 典型用法是`object.trigger('name', arg1, arg2, ...);`.
    trigger: function(name) {
      // 没有事件注册时直接返回.
      if (!this._events) return this;
      // 获取事件回调函数的参数.
      var args = slice.call(arguments, 1);
      // 见`eventsApi`的注释.
      if (!eventsApi(this, 'trigger', name, args)) return this;
      // 获取事件`name`的回调数组.
      var events = this._events[name];
      // 获取事件`'all'`的回调数组.
      var allEvents = this._events.all;
      // 执行`name`事件的所有回调.
      if (events) triggerEvents(events, args);
      // 执行`'all'`事件的所有回调.
      // 这里也就解释了为什么了注册了`'all'`事件后, 所有非`'all'`事件触发后都会执行`'all'`事件注册的回调.
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    // 解绑对对象`obj`的监听. 与`listenTo`和`listenToOnce`函数相对的操作.
    stopListening: function(obj, name, callback) {
      // 获取当前已监听对象. 为空时直接返回.
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      // 如果`name`和`callback`都为空, 则解绑对`obj`所有事件的监听.
      var remove = !name && !callback;
      // 如果callback是空, 且`typeof name === 'object'`, 则设置`callback = this;`
      // 这么写原因是考虑到如下的调用方式, 看官先体会下:
      // `object.stopListening(obj, {'name1': callback1, 'name2': callback2});`.
      // 下面注释对上面的调用做更多说明.
      if (!callback && typeof name === 'object') callback = this;
      // `obj`未指定时默认是针对所有已监听的对象, 注意此函数首行的代码.
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      // 遍历已监听对象.
      for (var id in listeningTo) {
        obj = listeningTo[id];
        // 调用解绑函数.
        obj.off(name, callback, this);
        // `remove`为true(见上面的解释)或当前被监听对象已不监听任何事件, 则从监听对象中删除此`obj`.
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  // 正则表达式, 匹配含有空格的字符串, 如'event1 event2'. 用于下面的`eventsApi`函数.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  // 上面的函数代码中多次遇到此函数的调用. 这里解释下此函数的场景:
  // 正常情况我们是通过`object.on(name, callback, context)`注册一个事件, 然而为了方便, Backbone同样支持:
  // `object.on({name1: callback1, name2: callback2}, context);`形式的调用, 同样还支持:
  // `object.on('name1 name2', callback, context);`形式的调用, 
  // `eventsApi`的存在就是为了将上面两种调用转成普通的形式.
  // 函数返回false说明`eventsApi`已处理.
  // 下面拿`on`函数中的调用方式举例说明:
  // `eventsApi(this, 'on', name, [callback, context])`.
  var eventsApi = function(obj, action, name, rest) {
    // `name`为空, 直接返回true, 由调用者继续处理.
    if (!name) return true;

    // Handle event maps.
    // 针对第一种形式.
    // 如果`name`值为`{name1: callback1, name2: callback2}`, 则typeof返回就是`'object'`.
    // `rest`为`[callback, context]`,
    // 又因为这种绑定写法的callback已经写在`name中`, 所以实际`callback`参数用于传递`context`, 而`context`参数为空.
    // 所以`rest`实际上等价于`[context]`.
    if (typeof name === 'object') {
      // 遍历上面对象的元素, 上例中`key`将分别为`'name1'`和`'name2'`.
      for (var key in name) {
        // 假设是`on`函数中调用此函数. 则这里转换后将是:
        // `obj['on'].apply(obj, [name1, callback1].concat(rest));`
        // 其中`rest`是`on`调用中的`context`, 所以最终其实下面的语句等价于:
        // `obj.on(name1, callback1, context);`
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    // 针对第二种形式.
    // 其实除了`{name1: callback1, name2: callback2}`形式的入参, 还支持另外一种形式的事件绑定:
    // `obj.on('name1 name2 name3', callback, context);`, 即绑定事件'name1'和'name2'和'name3'至同一个callback.
    // 这里name就是`'name1 name2 name3'`. 同时, 这时候`rest`是[callback, context].
    // 正则表达式匹配上面的`'name1 name2 name3'`.
    if (eventSplitter.test(name)) {
      // 将上面的`name`分割(以空格为界分割), 即最终`names = ['name1', 'name2', 'name3'];`.
      var names = name.split(eventSplitter);
      // 遍历`names`.
      for (var i = 0, l = names.length; i < l; i++) {
        // 由上, 下面的语句等价于:
        // obj.on('name1', callback, context);
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  // 触发事件的调用.
  // 这里的`events`数组的元素是`on`调用时压入的内容, 即`on`函数中的调用: 
  // `events.push({callback: callback, context: context, ctx: context || this});`
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    // 这里本可以直接用`default`的处理方式,
    // 之所以用`switch`是因为大多数的回调函数需要的参数都在三个以内(包含三个).
    // call方式回避apply方式快.
    switch (args.length) {
      // `call`和`apply`函数的第一个参数都是执行`callback`函数执行时的`context`值(即函数执行体中`this`就是这个值).
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // 这个变量为`listenTo`和`listenToOnce`函数定义使用
  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  // underscore的`each`遍历, 因为`listenTo`和`listenToOnce`的函数实现一样, `each`调用使得代码更加简洁.
  // 下面拿`listenTo: 'on'`举例说明具体的实现方法, `listenToOnce: 'once'`原理一样, 不做特别说明.
  _.each(listenMethods, function(implementation, method) {
    // 这里`method`是`listenTo`, `implementation`是`on`.
    // 即Events['listenTo'] = function(obj, name, callback) { }`.
    // 典型调用方式是`object.listenTo(obj, name, callback);`.
    // 其中`obj`是当前`object`想要监听的`obj`对象, `name`是监听的事件名, `callback`是监听事件触发时的回调函数.
    Events[method] = function(obj, name, callback) {
      // `object`需要维护已经监听的对象, 将被监听的对象存在`_listeningTo`变量中.
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      // 被监听对象的索引值是该对象的`_listenId`值, 这个值是唯一的.
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      // 存储被监听对象obj至`_listeningTo`中, 注: 这里`listeningTo`和`this._listeningTo`指向同一内存.
      listeningTo[id] = obj;
      // 如果callback是空, 且`typeof name === 'object'`, 则设置`callback = this;`
      // 这么写原因是考虑到如下的调用方式, 先体会下:
      // `object.listenTo(obj, {'name1': callback1, 'name2': callback2});`.
      // 下面注释对上面的调用做更多说明.
      if (!callback && typeof name === 'object') callback = this;
      
      // `obj['on'](name, callback, this);`.
      // 到这里发现原来最终是调用`obj`的`on`接口, 只是在调用时设置`context`(第三个参数)为`this`(即监听`object`).
      // 这里回味下`obj['on']({'name1': callback1, 'name2': callback2});`,
      // 再回到`object.listenTo(obj, {'name1': callback1, 'name2': callback2});`.
      // 如果上面不设置`callback = this`, 再`obj['on']({'name1': callback1, 'name2': callback2});`时, 下面的调用就相当于:
      // `obj['on']({'name1': callback1, 'name2': callback2}, null, this);`
      // 问题出现, 这样的话, 其实`on`调用会把第二个参数当做`context`传递, 
      // 因为传递值为`null`, 所以`on`调用会将`obj`自身设置`context`, 
      // 即最终相当于`obj`自身监听事件, 而不是`object`在监听,
      // 最终导致的结果就是事件触发后`callback`函数调用时内部的`this`指向`obj`而不是`object`.
      // 这就是上面有个`callback = this;`语句的原因!
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  // alias操作, 即object.on和object.bind等价, object.off和object.unbind等价.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  // 将Events的特性全部extend到Backbone, 即Backbone也可以做Backbone.on/Backbone.trigger这样的操作.
  _.extend(Backbone, Events);
```
