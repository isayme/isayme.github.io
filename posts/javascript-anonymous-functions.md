匿名函数是指运行时动态声明的函数. 之所以称为匿名函数是因为他们不像其他函数那样有一个名字.

匿名函数声明时用的[是函数操作符而不是函数声明](http://helephant.com/2012/07/14/javascript-function-declaration-vs-expression/). 你可以在任何需要一个表达式的地方使用函数操作符. 比如你可以为一个函数声明一个新的函数作为其参数或者声明一个新函数并赋值给另一个对象的某个属性.

这里有一个典型命名函数的例子:
```
function flyToTheMoon() {
    alert("Zoom! Zoom! Zoom!");
}
flyToTheMoon();
```

改成匿名函数就是这样:
```
var flyToTheMoon = function() {
    alert("Zoom! Zoom! Zoom!");
}
flyToTheMoon();
```

## 用函数操作符创建匿名函数 ##
函数声明和函数操作符是JavaScript两个最常见的创建函数方式. 匿名函数用的是函数操作符.

如果关键字`function`在一个声明中最先出现且紧跟一个函数名字, 那么这个函数是通过函数声明创建的:
![函数声明](http://isayme.qiniudn.com/function-declaration.png)

如果关键字`function`出现在任何其他地方, 那么这个函数极有可能就是通过函数操作符创建的:
![函数操作符](http://isayme.qiniudn.com/function-operator.png)

When the function operator is called, it creates a new function object and returns it. Here’s an example that creates a function and assigns it to a variable called flyToTheMoon:
当函数操作符被调用时, 一个新的函数对象将被创建并返回改函数对象. 下面的例子中我们创建一个函数并赋值给变量`flyToTheMoon`:
```
var flyToTheMoon = function() {
    alert("Zoom! Zoom! Zoom!");
}
```

其中赋值操作就像你将一个函数的返回值赋值给一个变量, 唯一特别的是这个返回值不是数字或日期这样的简单对象, 而是一个函数对象.

这是合法的, 因为JavaScript中函数只是一个类型特殊的对象. 也就是说函数可以像任何其他对象那样使用. 可以存在变量中, 作为参数传给其他函数或者通过`return`语句作为返回值从函数中返回. 不管他们是如何创建的, 本质上都是对象.

函数赋值给变量后, 该变量就可以用于调用该函数:
```
flyToTheMoon();
```

## 匿名函数是在运行时创建的 ##
函数操作符可以在任何可以使用一个表达式的地方使用. 你可以在给变量赋值的时候使用, 在一个参数传递给函数时使用或是在`return`语句时使用. 之所以可以这样就是因为函数操作符总在运行时调用.

函数声明不一样, 他们在其他代码执行之前就已经运行了, 所以函数声明不必放在改函数调用语句之前.

函数声明不能用于创建匿名函数, 因为函数声明要求该函数具有一个名字. 函数声明以函数名为变量名将自身赋给当前作用域.

## 匿名函数没有名字 ##
你可能会疑惑如何调用一个没用名字的函数? 这是因为函数名和函数对象变量是不同的.

函数声明创建的函数总有一个函数名和一个和函数名一样的函数变量, 函数声明自动帮你创建这个函数变量: 
```
function flyToTheMoon() {
    alert("Zoom! Zoom! Zoom!");
}
flyToTheMoon();
```

对于函数操作符创建的函数, 函数名是可选的. 多数情况下, 函数名对我们来说意义不大, 所以我们像下面这样创建一个匿名函数:
```
var flyToTheMoon = function() {
    alert("Zoom! Zoom! Zoom");
}
flyToTheMoon();
```

然而如果你愿意, 函数操作符同样支持为函数设置一个函数名. 下面就是一个例子:
```
var flyToTheMoon = function flyToTheMoon() {
    alert("Zoom! Zoom! Zoom");
}
flyToTheMoon();
```

匿名函数的函数名不会自动在当前作用域添加一个用于保存该函数的变量. 你仍要将函数操作符的返回值赋给一个变量.

上个例子中, 保存函数对象的变量名和函数名是相同的, 但这不是必须的:
```
var thingsToDoToday = function flyToTheMoon() {
    alert("Zoom! Zoom! Zoom");
}
thingsToDoToday();
```

## 匿名函数为什么要有个名字? ##
这样匿名函数就可以在自身内部调用自己. 这对于递归调用非常有用.
```
var thingsToDoToday = function flyToTheMoon() {
    if (!onTheMoon) {
        flyToTheMoon();
    } else {
        alert("One small step for a man..");
    }
}
thingsToDoToday();
```

对于调试也同样有帮助, 因为你可以才调用栈中看到函数名. 匿名函数在调用栈中看起来都一样. 如果你恰好遇到一个极其恶心的调试场景, 给匿名函数一个名字说不定会让你豁然开朗.

## 匿名函数? ##
很多情况函数名对我们没啥用, 可以不给匿名函数命名自然会很方便. 多数时候匿名函数和命名函数都可以完美实现功能.

更多关于如何使用匿名函数可以参见[这些例子](http://helephant.com/2012/07/14/javascript-function-declaration-vs-expression/#function-operator-is-an-expression)

## 然后呢? ##
有时你想创建大量具有相同属性和方法的对象. 那么你要找的是[构造器函数](http://helephant.com/2008/09/constructor-functions/), 它就是那个可以为你创建尽可能多同类型对象的工厂.

本文是[JavaScript对象机制](http://helephant.com/2008/08/how-javascript-objects-work/)系列的一篇.

> 
> 原文: [Javascript anonymous functions](http://helephant.com/2008/08/23/javascript-anonymous-functions/)
> 
