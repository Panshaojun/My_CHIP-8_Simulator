# 前言
因为写了个小游戏坦克大战（属实很小哈），想到了小时候玩的插卡的电视游戏机（小霸王），就想能不能做个模拟器？

后来网上查了很多资料，在github看了一个国外大佬用js写了一个nes模拟器(就是小霸王那种游戏机)，源码一看太多了，太费时间了，难受。

又看到如果想写个模拟器的话，最好模拟chip8游戏机，因为它的操作码只有30几个，入门够了。

于是我开始着手做做看。

#  技术栈
原生JavaScript(含有ES6)

# 准备
### 查资料
我在维基百科上看到了关于chip8的资料，CPU有哪些寄存器，又各有多少种，还提供了详解操作码的连接。

### 需要的知识
*  位操作，CPU处理的是机器码，毫无疑问和位操作脱不了干系。还好，位操作只有4种就够了，很简单；
*  了解16进制，其实对于2进制的机器码，16进制真的是方便且易懂；
*  如果为了更省内存（优化），其实js提供了很多中数据结构，有存储8位、16位等等数据的数组。不必使用基本类型number（32位）

# 效果
参阅：work.panshaojun.cn