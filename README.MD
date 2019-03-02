---
title: "开发文档"
export_on_save:
  html: true
---
# 1. 业务规范

1. 列表footer
列表底部需要展示共有多少条数据，一般有分页的列表都会有这个数据

2. 列表返回
列表返回需要记录原来的位置，可以模仿account/GardenList.jsx的写法。
目前的写法是，通过model缓存每次查询列表的数据，并且model里的写法是每次查询列表都会使用已经缓存的数据。
需要注意的是，不是以返回方式进入页面的，需要清理缓存，如下。
另外，类似搜索的情况，要重置缓存里面的部分数据，比如搜索项清空，页码重置为第一页等

    ```jsx
    componnetWillMount() {
            const type = getParameter('type');
            if (!type || type !== 'back') {
                this.props.dispatch({
                    type: 'garden/setData',
                    payload: {
                        cacheFilter: {
                            pageVo: {
                                page: 0,
                                pageSize: 10
                            }
                        },
                    }
                })
            }
        }
    ```
3. 按钮
大部分按钮，文字是必须的，至于图标是否必要，与其它页面保持一致即可

# 2. 账号
18758037064  037064 运营工具 超级管理员
18500000000  000000 运营工具 园长账号

**注意：**
园长账号，目前主要是【自定义课表】和【教师管理】页面会用到，所以修改这两个页面的时候，需要注意，这两个页面，要兼顾**园长账号**，以及公司自己的**运营账号**

如果遇到管理员账号没有权限了，联系后台同学，一般是因为他们把正式库的数据同步到数据库里了，导致账号没有权限了
# 3. 公共方法utils.js
## 3.1. 缓存
localStorage的管理方法，主要是增加了BASE64和
```jsx
cacheManager.get() //返回所有缓存
cacheManager.get('uid') //返回某一项缓存
cacheManager.set(key,value) //添加缓存
cacheManager.clear() //清空缓存
```
## 3.2. 截取视频首帧
```jsx
captureVideoImage({
    link,
    fileType,
    fileName,
    quality
})
```
截取视频首帧图，视频地址需要支持跨域访问

## 3.3. 登录判断
判断该路由是否需要登录才能访问
这个方法，看一下utils.js里面的注释就行，后面基本上不会改动，例如BasicLayout.js里是这么写的：
```jsx
componentWillMount() {
    checkIfLogin(["#/user/login", "#/user/register", "#/user/register-result"], "#/user/login");
    // 如果没有登录，也不在以上3个路由中，则跳转到 #/user/login
}
```

## 3.4. 获取地址栏传参
地址栏取参数方法

    getParameter(name)
    name:string 不传参则取出所有参数
    return：object

## 3.5. server
* 暴露服务器接口
服务器大部分接口都是一致的，但是部分接口会比较特殊，需要在这里单独配置访问格式
比如：
```
    imgUploadUrl: `${serverPath}/rest/upload/avatarHome`,
    htmlUploadUrl: `${serverPath}/rest/upload/document`,
```
* 服务器ip和port是在public/ipConfig里配置的，这是为了方便测试，项目打包之后修改服务器地址用的

## 3.6. 其它
另外请关注我们package.json里引入的包文件
其中lodash和moment建议用起来

# 4. H5开发
由于H5之间相对独立，并且绘本馆的大部分H5要求压缩和混淆加密，因此配置了gulp进行单独的H5构建

所以进行绘本馆的H5开发时，不需要开启运营工具，也不需要再找ftp部署H5

注意：邀请注册 和 重新加入班级 两个H5，对应的js分别是es/main.js 和 es/rejoin.js
这两个地址在访问的时候，需要带classCode和uid，分别是班级code和老师的uid，此外，app在访问这个地址的时候，还会再加上userType的一个参数

## 4.1. 注意事项
不要在css和scripts目录下创建代码，会被自动化编译删除
不需要编译的代码，以及第三方的插件，建议放到lib下

## 4.2. gulp命令
建议使用gulp命令，防止有时候项目没有配置package.json，或者package.json没有及时更新

### 4.2.1. gulp / gulp default
编译scss和es
然后开启相关的监听

### 4.2.2. gulp build
清理css和scripts目录
然后编译scss和es

### 4.2.3. gulp clean
仅清理css和scripts目录

### 4.2.4. gulp zip
清理css和scripts目录
编译scss和es
清理zip文件
压缩zip文件

## 4.3. 参数
* --dev
以上的几种命令，都可以带上--dev参数
以开发模式进行编译，为方便调试：
生成sourcemaps
不进行混淆加密

# 5. 分支管理

dev分支，开发结果都会合并进dev分支来打包。
开发新功能：从**dev** 开 **dev-功能名** 分支
修复当前版本bug：从**dev** 开 **dev-debug-功能名** 分支
修复往期版本bug，从版本号开分支，例如：从 **2.1.0** 开 **2.1.0-debug-功能名** 分支

**注意：**
如：dev-、2.1.0- 开头的分支，都属于临时分支，整个开发流程结束后，需要在git.ellabook.cn上删除分支，删除过程中注意分支合并情况。

往期bug修复，除了要合并到对应版本分支里面，还要合并到dev分支。切忌因为偷懒，懒得开分支，这样不利于后期的代码回退。

代码的分支合并，除非有冲突不好处理，尽量不要在本地进行，尤其在开发人员比较多的时候。合并分支通过在git.ellabook.cn上发起merge request进行

# 6. 项目结构

由于是mvvm的一个设计，项目分层会稍微多一点，不要因为偷懒把model或者service省略掉

## 6.1. route

业务页面目录

## 6.2. components

公共组件目录，如果是业务组件，没有复用的可能，请直接写在route目录下，即业务页面下，甚至可以写在业务页面里面。

## 6.3. models

数据模型目录
一个业务，对应至少一个model
数据尽量通过model存储

## 6.4. services
全是异步请求方法，通过async声明
主要提供给各个model调用

```
├── mock                        # 本地模拟数据
├── public
│   └── favicon.ico             # Favicon
│   └── ipConfig.js             # 定义整个项目的服务端地址，打包之后，这个文件不要上传到正式服
│   └── h5                      # 家园项目需要用到的H5页面
│   └── ueditor                 # 百度ueditor富文本编辑器，这个不要动，已经在components/Editor下封装好组件，使用方法见routes/Content/SubjectEdit
├── src
│   ├── assets                  # 本地静态资源
│   ├── common                  # 应用公用配置，如导航信息，路由信息
|   |   ├── menu.js             # 配置菜单信息
|   |   ├── router.js           # 配置路由信息
|   |   └── ellainfo.js         # 配置Ellabook通用信息，如标题，版本，底部信息等
│   ├── components              # UI组件（可复用的公共小组件）
│   ├── e2e                     # 集成测试用例
│   ├── layouts                 # 通用布局，最外层页面结构
│   ├── models                  # 数据模型层 model 前后端数据的校验和提醒在这里
│   ├── routes                  # 逻辑组件（主页面）
│   ├── services                # 后台接口服务
│   ├── utils                   # 工具库，通用方法，比如自己封装的一些函数
│   ├── g2.js                   # 数据可视化图形配置，数据图表框架
│   ├── index.ejs               # HTML 入口模板
│   ├── index.js                # 应用入口
│   ├── index.less              # 全局样式
│   ├── rollbar.js              # 追踪错误
│   ├── router.js               # 路由入口
│   └── theme.js                # 主题配置
├── tests                       # 测试工具
├── README.md
└── package.json
```
# 7. 框架知识点
## 7.1. 关于数据流向
 ![](https://tcs.teambition.net/thumbnail/1110200c1516aab3fb6dad7b017c75686227/w/800/h/252)

https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md

effect: 接受 action

同步行为发起 reducer 修改 State

## 7.2. component生命周期
**实际在Redux中，不需要关注太多组件的生命周期，而需要更多的关注数据的双向绑定**
![](https://tcs.teambition.net/thumbnail/1110d3e9b034c1c256261157179db3409445/w/800/h/827)


# 8. 文档
## 8.1. 基础文档

1. 官方文档 (关键问题没有解释清楚，有坑) ：https://pro.ant.design/docs/getting-started-cn
1. dva-docs (官方快速入门，更加实用高效) ：https://github.com/dvajs/dva-docs/tree/master/v1/zh-cn/tutorial
1. lodash (工具库) ： 最少需要了解一下对象操作的_.get,_.has方法，以及数组操作的 _.difference _.pull方法
1. moment (日期显示工具) ：需要了解一下日期格式化，以及相关工具类函数，比如获取当天的最早时间，最晚时间
http://momentjs.cn/docs/#/displaying/format/
http://momentjs.cn/docs/#/utilities/
1. numeral (数字格式化，反格式化) ：http://numeraljs.com/

## 8.2. 附加文档
1. AntD (配套的图表渲染框架) ：https://antv.alipay.com/zh-cn/g2/3.x/tutorial/index.html
1. 关于Redux-saga(put call 为redux-saga的api): http://leonshi.com/redux-saga-in-chinese/
1. 关于React(Action,reducer ...): http://cn.redux.js.org/index.html

# 9. VS Code 插件推荐
为了统一开发环境，减少不必要的麻烦，建议使用VScode开发，如果习惯其它编辑器也没关系，但是下面这些插件，有一些需要安装，我会标注出来。
```
Git History
  Git的log查看工具，支持分支线的视图
Markdown Preview Enhanced
  支持各种Markdown增强功能
  比如自动生成右侧展开目录
  比如自动导出html文件
  该插件有官网说明 https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/
TODO Highlight
  高亮TODO格式的注释
TODO Parser
  快速收集定位当前文件，或者当前项目的所有TODO
EditorConfig for VS Code
  识别.editorconfig文件，并且按照配置自动对齐，能够防止因为代码对齐导致的冲突
GitLens
  Git管理功能的增强工具，Git管理更加方便
``` 

# 10. 社区

https://gitter.im/ant-design/ant-design-pro
