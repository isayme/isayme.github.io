```
一篇11年的旧文, 纯属娱乐!
```

绝大多数网站(如论坛, SNS等)的登录页面都提供自动保存密码的功能, 一般个人电脑比较喜欢自动保存密码, 因为这样很方便, 不用每次都输入账号密码. 然而在方便的同时也留下了隐患: 网页自动保存的密码可以很简单的显示出来!

方法很简单, 拿时下流行(新注: 物是人非啦)的SNS网站淫淫网实验, 打开首页:

![解密前](http://isayme.qiniudn.com/javascript-password-before.png)

网站自动保存了密码(当然, 我这里密码已经被我换了, 是错误的密码~~), 想要查看密码, 只要将如下的代码粘贴到浏览器地址栏回车即可.有个问题需要注意, 如果使用的是chrome浏览器, 粘贴的时候浏览器会自动去掉"`javascript:`"这个前缀, 当然这是我们不希望的, 所以需要手动再次添加方可. 

```
javascript:(function(){var inputs=document.getElementsByTagName("input"); for(var i=0;i<inputs.length;i++) if (inputs[i].type==="password")inputs[i].type="text";})()
```

**注**: 新版的`firefox`浏览器已经不允许在地址栏直接执行`javascript`语句. 可以在`Firebug`的`console`标签中输入执行上面的代码.

回车之后即可看到网页保存的密码:

![解密后](http://isayme.qiniudn.com/javascript-password-after.png)

**原理**: 在`javascript`代码中, 查找网页的`input`输入框(包括账号及密码的输入框), 然后遍历所有的输入框, 判断如果此输入框的类型是`password`, 则改变其类型为`text`.即此时就可以查看密码了, 因为`text`类型的输入框的字符是可见的, 账号的输入框就是`text`的类型~

此方法仅在淫淫网上测试过, 其他的类似网站理论上都适用.需要指出的是像网银、支付宝的登录页面是不能用这个方法的, 因为它们的密码输入框都是自己开发的控件, 没有利用基本的html方法.
