不知你是否知道, `javascript`的`Function prototype`中有个叫`bind`的函数, 一旦用过你就会爱不释手. 这个函数是在ES5标准中新增(所以如果你在IE<9下开发, 我建议你看看`undersocre bind`的兼容实现)以方便开发者指定函数运行时的上下文(即`this`). 举个例子:
```
var f = function(){
    console.log(this.toString());
}
var bound = f.bind('bind');
bound(); // bind
```

另外, `javascript`中还有另一对好基友`call`&`apply`, 他们同样可以指定函数运行时的上下文:
```
var f = function(){
    console.log(this.toString());
}
f.apply('apply', []); // apply
f.call('call'); // call
```

那么问题来了: 如果`call`或者`apply`函数用在一个用`bind`绑定后的函数上会怎么样? 下面是测试代码:
```
var f = function(){
    console.log(this.toString());
}
 
var a = 'apply',
    b = 'bind',
    c = 'call'
;
 
var bound = f.bind(b);
 
bound(); // bind
 
f.apply(a, []); // apply
f.call(c); // call
 
bound.apply(a, []); // bind
bound.call(c); // bind
```

要自己试试么? 点击 [bind vs call & apply](http://jsfiddle.net/BcvE6/5/).

如你所见, `bind`的作用依然有效, `bind`之后的`call`&`apply`调用却没有起作用. 好吧, 以后再用到`call`&`apply`时我必须加倍小心了.

>原文: [Javascript function context: bind vs call & apply](http://arqex.com/853/javascript-function-bind-vs-call-apply) 

