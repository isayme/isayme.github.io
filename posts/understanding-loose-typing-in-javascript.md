JavaScript是很多前端开发者最先接触的脚本语言(或称解释语言). 弱类型对他们来说似乎很平常. 然而随着Web 2.0应用的爆发增长, 越来越多的后端开发者不得不涉足客户端技术. 其中大多数人之前都是用C#, Java这样的强类型语言, 不清楚弱类型语言开发时会有哪些潜在陷阱.

弱类型的概念是JavaScript的基础, 理解它至关重要. 本文主旨便在JavaScript的弱类型. 但鉴于不同语言的弱类型可能会稍有区别, 本文讨论的内容只限于JavaScript. 

## 什么是弱类型 ##
还是先从基础概念说起. 理解`弱类型是什么`以及`弱类型不是什么`都非常重要. 弱类型是指变量声明时不指名类型. 与之相反, 变量声明时指明类型的就是强类型. 比如下面的例子:
```
/* JavaScript Example (loose typing) */  
var a = 13; // Number declaration  
var b = "thirteen"; // String declaration  
      
/* Java Example (strong typing) */  
int a = 13; // int declaration  
String b = "thirteen"; // String declaration  
```
注意JavaScript声明的变量`a`和`b`时都用`var`修饰. 不过这并不是说它们没有类型, 也不是说他们的类型是`var`. JavaScript中的变量是类型化的, 即具体类型要看变量的值. 比如上面的例子中, 变量`a`的类型是`Number`而变量`b`的类型是`String`. `Number`和`String`是JavaScript三个`基本数据类型`中的两个, 第三个`基本数据类型`是`Boolean`.

除了`基本数据类型`, JavaScript中也有其他数据类型. 具体见下图(详见[Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)):
![javascript-date-type](http://isayme.qiniudn.com/javascript-date-type.jpg)

没错, `Null`和`Undefined`也是数据类型.

## 类型转换 ##
提到弱类型势必要提到类型转换. 既然数据类型是与数据有关, 那数据类型自然会因数据的改变而改变. 理解这个类型转换规则极为重要. 思考下面的表达式, 确保你能理解每一个:
```
7 + 7 + 7; // = 21  
7 + 7 + "7"; // = 147  
"7" + 7 + 7; // = 777  
```
上面的例子中, 算术运算从左往右结合正常执行, 直到遇到一个字符串. 从此之后, 所有的算子都被转成`String`类型并做字符串拼接操作.

类型转换在比较操作时也会发生. 不过你可以用`===`运算符进制类型转换. 思考如下的例子:
```
1 == true; // = true  
1 === true; // = false  
  
7 == "7"; // = true  
7 === "7"; // = false;  
```
也有方法可以显示转换一个变量的类型, 如`parseInt`和`parseFloat`(两者都是将`String`转成`Number`).

两个逻辑非(!!)运算也可用于将一个`Number`或`String`类型的变量转成`Boolean`类型. 思考下面的例子:
```
true == !"0"; // = false  
true == !!"0"; // = true  
```

## 总结 ##
本文显然不是JavaScript弱类型或类型转换的权威参考. 我只希望此文对那些尚不理解或正在温习这些知识点的开发者有所帮助. 我尽量确保本文内容的准确性, 但是如果你发现任何错误的地方, 请告知我! 最后, 多谢阅读!

> 原文:  [Understanding Loose Typing in JavaScript](http://blog.jeremymartin.name/2008/03/understanding-loose-typing-in.html)
