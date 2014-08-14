常见`Linux`发行版的默认`shell`都是`bash`. 当启动一个`bash`时, `bash`会尝试读取某个配置文件, 可能的配置文件有: `~/.bash_profile`, `~/.bash_login`, `~/.profile` 以及`~/.bashrc`. 但实际上`bash`**自己只读取其中的一个配置文件**, 依照的原则是: 

如果是`login shell`, 则 **依次** 查找`~/.bash_profile`, `~/.bash_login` 和 `~/.profile`, 找到任意一个并执行其中的命令, 且**不再查找**后续可能的配置文件. 伪代码:
```
# for login interactive shell
source /etc/profile
IF ~/.bash_profile exists THEN
    source ~/.bash_profile
ELSE
    IF ~/.bash_login exist THEN
        source ~/.bash_login
    ELSE
        IF ~/.profile exist THEN
            source ~/.profile
        END IF
    END IF
END IF
```

如果是`non-login shell`, 则查找`~/.bashrc`文件. 伪代码:
```
# for none-login interactive shell
source /etc/bash.bashrc
IF ~/.bashrc exist THEN
    source ~/.profile
END IF
```

这里通俗解释下`login shell`和`non-login shell`:
`login shell`: 当你通过`账号`和`密码`登录一个linux服务器时, 就是`login shell`;
`non-login shell`: 当你在登录linux服务器后, 在登录后的`shell`环境中执行`bash`命令, 进入的`bash shell`就是`non-login shell`(因为没用`账号`和`密码`登录). 另外当你登录一个图形界面的linux系统时, 在图形界面打开的`shell`(`Terminal`)也是`non-login shell`(因为也没用`账号`和`密码`登录).

那么`login shell`和`non-login shell`的不同有什么影响 ?
在linux系统使用中, 很可能需要修改`shell`某些环境变量(常见如改`PS1`变量)或添加一些自定义功能(增加`l`, `ll`命令等).
这里就遇到问题了, 我们的改动需要更新到两个文件中(因为他们读取的配置文件不同) !
当然, 实际上我们并没有这么做, 那怎么解决的 ? 以`Debian`的方法为例, 其他发行版都大同小异. 
`Debian`中, 一个账号下通常存在`.profile`和`.bashrc`两个配置文件, 分别对应`login shell`和`non-login shell`. 如果要增加自定义功能, 只需要将相应的代码添加在`.bashrc`中即可, 这时候`non-login shell`遍可以正常工作, 同时`login shell`也是正常的, 因为`.profile`文件中有这么一段代码:
```
# include .bashrc if it exists
if [ -f "$HOME/.bashrc" ]; then
. "$HOME/.bashrc"
fi
```
`.profile`文件中尝试执行了`.bashrc`中的内容, 所以`login shell`也能够正常工作.

一个特殊的`non-login shell`: 当我们在`shell`中使用`su`命令切换用户时(可能需要输入密码),  默认情况下切换用户后的`shell`也是`non-login shell`. 但是我们可以通过`su -`命令使得切换后的`shell`是`login shell`. 因为`su --help`帮助信息说道: 
```
Usage: su [options] [LOGIN]

Options:
  -, -l, --login                make the shell a login shell`
```

最后, 上面说到的`login shell`和`non-login shell`全称是`interactive login shell`和`interactive non-login shell`, 关于`interactive`和`non-interactive`的区别, 有兴趣的可以自行查找资料! 

参考资料:
[Execution sequence for .bash_profile, .bashrc, .bash_login, .profile and .bash_logout](http://www.thegeekstuff.com/2008/10/execution-sequence-for-bash_profile-bashrc-bash_login-profile-and-bash_logout/)
[6.2 Bash Startup Files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)
