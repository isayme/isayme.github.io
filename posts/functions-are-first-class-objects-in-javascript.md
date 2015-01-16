JavaScript中的函数属于[一等公民](http://en.wikipedia.org/wiki/First-class_function). 也就是说函数只是一个特殊类型的对象, 普通对象的任何特性它都有.

## 不骗你, 真和普通变量一样 ##
这里列举几个JavaScript中对象的主要特性, 这些特性函数同样拥有.

函数是Object类型的一个实例:
```
function feedCat() {
    alert("Kibble, tinned food and water");
}
alert(feedCat instanceof Object);
```
函数可以拥有属性, 甚至还有一个指向它构造方法的链接:
```
feedCat.food = "kibble";
alert(feedCat.food);
alert(feedCat.constructor);
```
可以将函数赋值给一个变量:
```
function feedCat() {
    alert("Kibble, tinned food and water");
}
var eveningChore = feedCat;
eveningChore();
```
可以将函数作为参数传给另一个函数:
```
function doEveningChores(chores) {
    for(var x=0; x<chores .length; x++)
        chores[x]();
}
doEveningChores([feedCat]);
```
可以从函数中return返回另一个函数:
```
function tonightChores(){
    return feedCat;
}
var tonight = tonightChores();
tonight();
```

## 减少冗余代码 ##
通常我们可以将程序的逻辑块写成库函数以减少不必要重复代码. 从而方便业务与逻辑代码的分离.

举个栗子, 假如你有很多巧克力棒, 其中Mars旗下的M&Ms品牌是你的最爱, 你迫切想把她们挑出, 同时你也准备试试其它的品种, 说不定哪个也合你胃口呢(尼玛节食七个月, 也只能这么解解馋了...).

你可以写一个循环遍历每个巧克力棒, 并写出如下删选方案:
```
var chocolateBars = [
    {name: "Galaxy", manufacturer: "Mars"},
    …];
var marsChocolate = [];
for(var x = 0; x < chocolatebars.length; x++) {
    if(chocolateBars[x].manufacturer == "Mars")
        marsChocolate.push(chocolateBars[x]);
}
```

完美! 问题搞定. 不过恰好圣诞节到了, 你需要挑出更多的巧克力品牌. 每年的这个时候你总会特别忙! 关键学校还教过你[不要重复造轮子](http://c2.com/cgi/wiki?DontRepeatYourself).

库函数该上场的时候到了! 分析下: 每次我们都要遍历已有的列表并依据不同的过滤条件新建列表. 所以我们可以将遍历已有列表和新建列表封装成一个库函数, 然后将过滤逻辑代码作为参数传给库函数:
```
var array_helper = {
    filter: function(list, filter)
    {
        var matches = [];
        for (var x=0; x<list .length; x++)
        {
            if (filter(list[x]))
                matches.push(list[x]);
        }
        return matches;
    }
};
var marsChocolate = array_helper.filter(chocolateBars,
    function(item) { return item.manufacturer == "Mars"
});
 
var naughtyList = array_helper.filter(childrenOfTheWorld,
    function(item) { return item.naughtiness > 50;
});
 
var niceList = array_helper.filter(childrenOfTheWorld,
    function(item) { return item.naughtiness <= 50;
});
```

现在再想删选出某些巧克力就非常简单了. 有什么问题很容易就发现. 而且只要改一个地方就可以. 现在你能随时找出美味的糖果, 全世界的小朋友都能收到圣诞礼物啦.

过滤函数如此高大上以至于[JQuery](http://docs.jquery.com/Traversing/filter#fn)和[Dojo](http://api.dojotoolkit.org/jsdoc/dojo/HEAD/dojo.filter)都对其做了支持. [JavaScript 1.6](http://developer.mozilla.org/en/docs/New_in_JavaScript_1.6#Array_extras)标准会原生支持过滤函数. 当然, 该理念可用在其它更多的地方以减少冗余代码.

## 方法本质就是函数 ##
JavaScript中对象的方法并不是什么特别的东西. 他们不过是一个恰好保存函数而不是字符串或数字的属性:
```
var sabby = {
    name: "Sabby",
    species: "cat",
    hello: function() { alert("hissss"); }
};
```
这样就不用针对对象方法做特别的设计, 不得不佩服JavaScript设计者的精明. 这也是[JavaScript无需类就可以生成对象](http://helephant.com/2008/08/building-simple-objects/)的原因之一.

## 使得JavaScript灵活, 动态 ##
JavaScript的灵活性很大程度上来源于能够将函数视作普通对象. 基本上每篇关于JavaScript对象的文章都会利用这个特性.

JavaScript中所有关于对象使用的基础技术都依赖于这个特性. 简单对象, 构造函数以及原型都涉及将方法(即函数)赋值给一个对象的属性.

它使得JavaScript灵活和轻便. 可以利用函数模拟其他语言的优秀特性如命名空间, 自定义事件, 静态方法以及扩展方法.

## 延伸阅读 ##
我能找到最好的是一篇讲述[JavaScript函数式编程](http://www.hunlock.com/blogs/Functional_Javascript)的文章. 此文讲述了大量JavaScript的函数式编程特性.

Raganwald的[闭包及高阶函数](http://weblog.raganwald.com/2007/01/closures-and-higher-order-functions.html), 此文讲述闭包及高阶函数的作用, 虽然说的是Ruby和Java, 但理论同样适用于JavaScript.

## 下一步? ##
[匿名函数](http://isayme.github.io/#javascript-anonymous-functions.html)是指运行时通过函数表达式动态创建的函数. 匿名函数与作为一等公民的函数共同成为JavaScript动态, 灵活的两大主要因素.

本文是[JavaScript对象机制](http://helephant.com/2008/08/how-javascript-objects-work/)系列的一篇.

> 
> 原文: [Functions are first class objects in javascript](http://helephant.com/2008/08/19/functions-are-first-class-objects-in-javascript/)
> 
