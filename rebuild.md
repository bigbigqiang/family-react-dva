---
title: "重构记录"
export_on_save:
  html: true
---

# 1. 优化 2018-9

本期优化基于master分支，新开rebuild分支进行。内容与1.1.5保持一致。

模块包括【账号管理】、【课程设置】、【兑换码】
剩余模块【课程设置】、【APP首页管理】、【版本更新】、【业务数据】、【订单管理】

剩余模块会在1.1.5上线并不做改动之后优化

## 1.1. 提前报错位置 *

现已在request方法中进行了接口报错处理，包括接口无返回，status不为1，res.data不存在情况，因此，现在model只用关心业务成功之后，是否需要给页面做出Message提醒

## 1.2. Model 简化 *

  Model 层不用关心业务失败的消息提醒，这部分功能已经全部提取到接口请求方法里面。现在只需要在根据业务需求，给出成功的提醒就行。由于像列表请求成功这样的请求不需要提醒，因此成功继续由 Model 来写

  另外，简化了 Model 中 reducers 的写法，现在只用关心effects的写法

  后续model的写法，可以参考 model/authority.js 的写法进行修改

## 1.3. 提出字典 dict() 方法 *

dict的主要目的是对服务端返回的字符串进行翻译,不要用来做其它用途，避免不必要的麻烦。

dict的写法及对应的字典如下

```js
// 基础用法，直接按字符串翻译
dict('NORMAL');

// dict.js
let dictionary = {
    'NORMAL':'正常'
}
```

```js
// 添加前缀，与其它同名字段区分
let status='NORMAL';
dict('ORDER_'+status);

// 前缀还可以这么添加
dict(status,{prefix:'ORDER'}) // 会自动拼接为 ‘ORDER_’+status

// dict.js
let dictionary = {
    'NORMAL':'正常',
    'ORDER_NORMAL':'排列正常'
}
```

```js
// 对象传参，其中获取text类型的写法最为宽松
dict('NORMAL')
// 也可以，虽然不常见，但是需要用到的时候就明白了
dict('NORMAL',{type:'text'})

// dict.js
let dictionary = {
    'NORMAL':'正常',
}
// 或者如下写法也行
let dictionary = {
    'NORMAL':{
        text:'正常'
    },
}
```

```js
// 对象传参，获取 badge
dict('NORMAL',{type:'badge'})

// 必须设置typew
let dictionary = {
    'NORMAL':{
        text:'正常',
        badge:'success'||'warning'||'processing'||'error'
    },
}
```

```js
// 对象传参，获取 link
dict('NORMAL',{type:'link'})

// 必须设置typew
let dictionary = {
    'NORMAL':{
        text:'正常',
        link:'/account/partner'
    },
}
```

![微信截图_20181008150922](/assets/微信截图_20181008150922.png)
![微信截图_20181008150931](/assets/微信截图_20181008150931_lkmpx3mt6.png)

## 1.4. 界面优化 *

1. Table尺寸，统一为small，并且为边框表格，如下添加两条属性即可
```js
    <Table
        size="small"
        bordered
        ... ...
    ></Table>
```

2. 表内容居中，定了完columns之后，遍历为各项添加对齐属性，居中
```js
    let columns = [
        ... ...
    ]

    for (var key in columns) {
        columns[key].align = 'center'
    }
```

3. 部分表格列，需要固定宽度，例如 权限管理/成员列表
这里，成员名称属于宽度不固定的，但其它都是可以固定宽度的列，因此可以给定具体的width属性
```js
}, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 100
}, {
```
![微信截图_20181008100846](/assets/微信截图_20181008100846.png)

4. 导航条颜色及尺寸，目前已统一为自定义的导航条，尺寸更小，石距不冲突

5. 部分不合格界面的重排，这块需要各页面开发者根据antd风格自行统一一下，目前对于早期页面已经完成了重构


## 1.5. 早期页面的字段替换

第一期工作相关页面，数据字段与后端不一致，因此按照后端返回字段进行修改，提高联调效率

## 1.6. 清理无用的引用

部分页面存在复制的情况，因此很多应用是不必要的，本次重构会逐渐清理掉

## 1.7. 替换Component为PureComponent

PureComponet相对而言，render执行的次数更少，只在state或者model的state发生变化的时候，才触发页面渲染，性能会更好一点
# 2. 优化 2018-12
本次主要是针对域名迁移
原：http://ellabook.cn/ellabook-family/
迁移到：https://familyoms.ellabook.cn/

由于H5项目，banner，专题都与域名相关，因此需要进行如下代码调整：
## 2.1. 数据库调整
1. APP首页管理->Banner图 对应的数据库，需要将 "http://ellabook.cn/ellabook-family/" 查找替换为 "https://familyoms.ellabook.cn/"

2. APP首页管理->专题管理 对应数据库，做以上处理

3. APP首页管理->广告横幅 H5页面类型的，同样做以上处理

## 2.2. H5调整
1. 邀请注册链接
2. 用户协议
3. 关于我们

# 3. 优化 2019-01
## 返回记录列表位置
1. 账号管理-幼儿园列表
1. 账号管理-自主注册园列表
1. 兑换码-兑换码管理列表
1. 兑换码-VIP管理
