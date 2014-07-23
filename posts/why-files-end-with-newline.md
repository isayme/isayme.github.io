之前也见过有说源码文件尾要空一行, 但一直不知道为什么, 所以自己在写代码的时候也没有特意添加空行.

今天在[V2EX](https://www.v2ex.com/t/123976)看到帖子[什么时候程序源码文件末尾要有空行? 是怎么规定和考虑的?](https://www.v2ex.com/t/123976), **强迫症**瞬间就复发, 索性就较真一下!

首先, 这是个**历史遗留问题**. 另外, 吹毛求疵点, 其实要求的不是文件尾要`空行`, 而是文件尾要有`换行符`(`new-line`).

那么为什么要添加`换行符`? 先来个显而易见的:
```
$ more a.txt
foo$ more b.txt
bar
$ more c.txt
baz
$ cat *.txt
foobar
baz
```
上面的例子中, `a.txt`没有文件尾的换行符, 导致shell的提示符(`prompt`)`$ `紧跟在`a.txt`文本内容之后. 请自行对比有换行符的`b.txt`文件.  
同样的原因, 在`cat *.txt`时候会导致`b.txt`文件的内容紧跟在`a.txt`文件内容之后, 如果文件内容很多, 不利于区分.

当然了, 上述的问题不足以强迫我们在文件尾添加`换行符`, 不过`C`语言规范中提到要在文件尾添加`换行符`, [Re: wny does GCC warn about "no newline at end of file"?](https://gcc.gnu.org/ml/gcc/2003-11/msg01568.html)中说在`89`版规范的`2.1.1.2`章节和`99`版规范的`5.1.1.2`章节中说道: **A source file that is not empty shall end in a new-line character, which shall not be immediately preceded by a backslash character.**. 如果没有`换行符`, gcc会有warning: "No newline at end of file".

既然规范这么要求, 我们照做就好. 但这显然不是**强迫症患者**的风格! 我们想知道: `Why ?`

要知道答案, 需要追溯到上古时期(好吧, 其实也就是20世纪后半叶), 那个时代对文本文件(源码文件也属于文本文件)的定义: **A [text file](http://pubs.opengroup.org/onlinepubs/009695399/basedefs/xbd_chap03.html#tag_03_392), under unix, consists of a series of lines, each of which ends with a newline character(`\n`). A file that is not empty and does not end with a newline is therefore not a text file.**

原来文本定义就要求要每行都有以`换行符`结尾, 依据这个前提, 当时很多的文本处理工具(`diff`, `sed`, `gcc`之类)在读取到不以`换行符`结尾的行时会认为这是不完整的一行内容, 有的**甚至会忽略**那一行的内容, 导致意想不到的问题. 

所以, 为了免去那些不必要的麻烦, 还是乖乖加上一个`换行符`吧!

以上!

参考资料:
[Why should files end with a newline?](http://stackoverflow.com/questions/729692/why-should-files-end-with-a-newline)
[Why do I need vim in binary mode for 'noeol' to work?](http://stackoverflow.com/questions/16222530/why-do-i-need-vim-in-binary-mode-for-noeol-to-work)
[Re: wny does GCC warn about "no newline at end of file"?](https://gcc.gnu.org/ml/gcc/2003-11/msg01568.html)
[What's the point in adding a new line to the end of a file?](http://unix.stackexchange.com/questions/18743/whats-the-point-in-adding-a-new-line-to-the-end-of-a-file)
