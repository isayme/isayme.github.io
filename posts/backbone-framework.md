```
// 典型自执行函数格式:
// (funtion(root, factory) {
//   // do stuff here
// })(this, factoryFunc);
// 其中`root`就是`this`, `factory`就是`factoryFunc`;
// 而`this`又根据环境的不同而不同, 具体见下面的注释.
(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  // 如果是AMD的模块规范(require.js使用的规范, 主要用于浏览器端).
  // AMD规范中, define是一个用于定义模块的函数, 且define.amd标识这是AMD规范的模块.
  if (typeof define === 'function' && define.amd) {
    // 利用define函数定义模块, 依赖'underscore', 'jquery', 'exports'三个库.
    // 此时的`root`是`exports`.
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  // 如果是CMD的模块规范(NodeJS使用的规范, 主要用于服务器端).
  // CMD规范中, exports是用于导出模块的对象.
  } else if (typeof exports !== 'undefined') {
    // 导入underscore库.
    var _ = require('underscore');
    // 注意factory的格式是: `function(root, Backbone, _, $)`
    // AMD规范中, 此时的`root`是`exports`, 对`root`的所有更改其实都作用于`exports`.
    // 第二个参数`Backbone`传入的是`exports`, 所以factory内部对`Backbone`的所有更改其实都作用于`exports`.
    // 第三个参数是underscore.
    // 服务器端没有View的概念, 即第四个参数为空.
    factory(root, exports, _);

  // Finally, as a browser global.
  // 如果没有使用任何模块规范.
  } else {
    // 浏览器中, root指的是`windows`对象.
    // 注意factory的格式是: `function(root, Backbone, _, $)`
    // 第一个参数`root`, 对`root`的所有更改其实都作用于`windows`,
    // 其实在factory内部`root`的主要用于noConflict函数, 作用是保存之前的已经存在的root.Backbone变量, 防止覆盖.
    // Backbone的所有属性都添加到第二个参数`{}`中, 函数返回修改之后的`{}`(即Backbone)并赋值给root.Backbone;
    // 即这时候就存在windows.Backbone了.
    // 第三个参数是传入underscore, 所以必须保证Backbone载入前underscore已经载入.
    // 第四个参数是jQuery或类似的DOM操作库.
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // 版本号.
  Backbone.VERSION = '1.1.2';
  
  // jQuey或Zepto或其他类似功能的库.
  Backbone.$ = $;
  
  // 防止命名冲突.
  Backbone.noConflict = function() { };
  
  // 提供事件机制.
  var Events = Backbone.Events = { };
  
  // 数据Model.
  var Model = Backbone.Model = function(attributes, options) { };
  
  // 数据Collection.
  var Collection = Backbone.Collection = function(models, options) { };
  
  // View展示.
  var View = Backbone.View = function(options) { };
  
  // sync接口, 对ajax的一次封装.
  Backbone.sync = function(method, model, options) { };
  
  // ajax请求
  Backbone.ajax = function() { };
  
  // 提供路由机制.
  var Router = Backbone.Router = function(options) { };

  // 浏览历史机制.
  var History = Backbone.History = function() { };

  // History的实例.
  Backbone.history = new History;

  // 返回Backbone对象
  return Backbone;

}));
```
