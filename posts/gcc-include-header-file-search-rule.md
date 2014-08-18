如果问: `#include <xxx.h>`和`#include "xxx.h"`有什么区别 ?
相信大多数C农都知道: 前者是在**标准系统目录**(`standard system directories`)下查找`xxx.h`文件, 后者会先尝试在当前文件夹查找`xxx.h`, 如果未找到按前者的方式继续尝试查找.

我们称头文件查找的目录列表为**查找路径**(`search path`).

问题是, **标准系统目录**(`standard system directories`) 到底是哪些目录 ?

GNU官方文档[2.3 Search Path](https://gcc.gnu.org/onlinedocs/cpp/Search-Path.html)说`search path`是: 
```
/usr/local/include
/usr/lib/gcc/target/version/include  # target是系统架构名称, version是gcc版本号
/usr/target/include
/usr/include
```

不过, 个人感觉官方的说法还**不够严谨**! 较为严谨的`search path`是这样的: 

1. 如果`gcc`编译时有`-Idir`参数, 则尝试在指定的`dir`中查找;
2. 如果存在环境变量`CPATH`, 则在指定的目录中查找;
3. 如果存在环境变量`C_INCLUDE_PATH`, 则在指定的目录中查找;
4. `gcc`编译时的默认路径(类似但不完全相同于上面GNU官方的那个说法);

查看当前`gcc`环境的`search path`是什么, 可以在shell中执行`echo | cpp -Wp,-v`, 得到的结果应该类似于:
```
$ echo | cpp -Wp,-v
ignoring nonexistent directory "/usr/local/include/x86_64-linux-gnu"
ignoring nonexistent directory "/usr/lib/gcc/x86_64-linux-gnu/4.7/../../../../x86_64-linux-gnu/include"
#include "..." search starts here:
#include <...> search starts here:
 /usr/lib/gcc/x86_64-linux-gnu/4.7/include
 /usr/local/include
 /usr/lib/gcc/x86_64-linux-gnu/4.7/include-fixed
 /usr/include/x86_64-linux-gnu
 /usr/include
End of search list.
```

注:

1. 参数`-nostdinc`可以将`standard system directories`从`search path`中删除;
2. 如果存在多个`-Idir`配置, 查找时按出现的先后顺序查找;
3. 如果`CPATH`和`C_INCLUDE_PATH`中需要配置多个路径, 用冒号`:`分割;
4. 以上内容仅针对`gcc`, `g++`稍有不同.


**参考资料**
[2.1 Include Syntax](https://gcc.gnu.org/onlinedocs/cpp/Include-Syntax.html)
[2.3 Search Path](https://gcc.gnu.org/onlinedocs/cpp/Search-Path.html)
[3.19 Environment Variables Affecting GCC](https://gcc.gnu.org/onlinedocs/gcc-4.8.1/gcc/Environment-Variables.html)
[Finding out what the GCC include path is](http://stackoverflow.com/questions/17939930/finding-out-what-the-gcc-include-path-is)
