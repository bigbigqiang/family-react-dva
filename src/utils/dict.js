import { Badge } from 'antd';

let dictionary = {

    // 数据状态
    'NORMAL': {
        text: '正常',
        badge: 'success',
    },
    'EXCEPTION': {
        text: '停用',
        badge: 'warning',
    },
    'DELETED': {
        text: '删除',
        badge: 'error',
    },
    // 账户类型
    'ACCOUNT_TEACHER': {
        text: '教师',
    },
    'ACCOUNT_SALESMAN': {
        text: '业务员',
    },
    'ACCOUNT_PARTNER': {
        text: '合伙人',
    },
    'ACCOUNT_HEADMASTER': {
        text: '园长',
    },
    'ACCOUNT_PARENT': {
        text: '家长',
    },
    'ACCOUNT_1': {
        text: '运营人员',
    },
    // 合伙人类型
    'PARTNER_AGENT': '代理商',
    'PARTNER_EDU': '教育机构',

    // 幼儿园状态
    'GARDEN_TRIAL': {
        text: '试用',
        badge: 'warning'
    },
    'GARDEN_NORMAL': {
        text: '可用',
        badge: 'success'
    },
    'GARDEN_DELETED': {
        text: '停用',
        badge: 'error'
    },
    'GARDEN_PUBLIC': {
        text: '公立'
    },
    'GARDEN_PRIVATE ': {
        text: '私立'
    },
    'GARDEN_NO_SUBMIT': {
        text: '未提交',
        badge: 'warning'
    },
    'GARDEN_TO_AUDIT': {
        text: '待审核',
        badge: 'warning'
    },
    'GARDEN_PASS': {
        text: '通过',
        badge: 'success'
    },
    'GARDEN_NO_PASS': {
        text: '未通过',
        badge: 'error'
    },

    // 班级状态
    'CLASS_NORMAL': {
        text: '正常',
        badge: 'success'
    },
    'CLASS_GRADUATE': {
        text: '已毕业',
        badge: 'warning'
    },

    // 兑换码
    'VIP_UNREGISTERED': {
        text: '手机未注册',
        badge: 'warning',
    },
    'VIP_SUCCESS': {
        text: '赠送成功',
        badge: 'success',
    },

    // Banner图状态
    'BANNER_OFFLINE': {
        text: '已下线',
        badge: 'error'
    },
    'BANNER_EXCEPTION': {
        text: '草稿',
        badge: 'warning'
    },
    'BANNER_NORMAL': {
        text: '已上线',
        badge: 'success'
    },

    // APP首页状态
    'APPINDEX_YES': {
        text: '已发布',
        badge: 'success'
    },
    'APPINDEX_NO': {
        text: '待发布',
        badge: 'warning'
    },

    // APP首页路由
    'APPINDEX_BANNER': {
        text: 'banner模块',
        link: '/content/banner'
    },
    'APPINDEX_WIKI': {
        text: '分类模块',
        link: '/content/appclass'
    },
    'APPINDEX_FREE': {
        text: '免费专区',
        link: '/content/appclass'
    },
    'APPINDEX_SUBJECT': {
        text: '专题模块',
        link: '/content/subjects'
    },
    'APPINDEX_AD': {
        text: '广告模块',
        link: '/content/adbanneryin'
    },
    'APPINDEX_CUSTOM': {
        text: '自定义模块',
        link: '/content/customcolumn'
    },
    //听单路由
    'LISTEN_AD': {
        text: '广告模块',
        link: '/listen/listenad'
    },
    'LISTEN_WIKI': {
        text: '分类模块',
        link: '/listen/listenclass'
    },
    'LISTEN_LISTEN_LIST': {
        text: '听单模块',
        link: '/listen/listenlist'
    },

    // APP分类管理
    'APPCLASS_SYSTEM_INTERFACE': '系统界面',
    'APPCLASS_CUSTOM': '自定义栏目',
    'APPCLASS_H5': 'H5页面',
    'APPCLASS_LISTEN': '听单',

    // 专题状态
    'SUBJECT_OFF_LINE': {
        text: '下线',
        badge: 'error'
    },
    'SUBJECT_EXCEPTION': {
        text: '草稿',
        badge: 'warning'
    },
    'SUBJECT_NORMAL': {
        text: '上线',
        badge: 'success'
    },

    // 自定义栏目
    'CUSTCOL_ON_LINE': {
        text: '已展示',
        badge: 'success'
    },
    'CUSTCOL_NORMAL': {
        text: '未展示',
        badge: 'warning'
    },
    'CUSTCOL_EXCEPTION': {
        text: '删除',
        badge: 'error'
    },

    // 广告横幅
    'AD_SHOW_ON': {
        text: '已展示',
        badge: 'success'
    },
    'AD_SHOW_OFF': {
        text: '未展示',
        badge: 'warning'
    },
    'AD_YES': {
        text: '已展示',
        badge: 'success'
    },
    'AD_NO': {
        text: '未展示',
        badge: 'warning'
    },
    'AD_SYSTEM_INTERFACE': '系统界面',
    'AD_CUSTOM': '自定义栏目',
    'AD_H5': 'H5页面',
    'AD_111': '系统界面',//测试用
    'AD_LISTEN': '听单',//测试用

    // 听书类型
    "LISTENTYPE_VOICE": "音频",

    // 订单
    "ORDER_WXPAY": '微信',
    "ORDER_APPLE_IAP": '苹果',
    "ORDER_ALIPAY": '支付宝',
    "ORDER_HUAWEIPAY": '华为',
    "ORDER_ELLA_COIN": '咿啦币',
    "ORDER_CORPORATE": '对公支付',
    "ORDER_WXOAPAY": '微信公众号',

    'ORDER_PAY_WAITING': {
        text: '待支付',
        badge: 'processing'
    },
    'ORDER_PAY_SUCCESS': {
        text: '已支付',
        badge: 'success'
    },
    'ORDER_PAY_EXPIRED': {
        text: '已失效',
        badge: 'error'
    },
    'ORDER_PAY_CANCELED': {
        text: '已取消',
        badge: 'warning'
    },

    // 审批管理
    'APPROVAL_PASS': {
        text: '通过',
        badge: 'success'
    },
    'APPROVAL_NO_PASS': {
        text: '未通过',
        badge: 'error'
    },
    'APPROVAL_TO_AUDIT': {
        text: '待审核',
        badge: 'warning'
    },


}

// 最终用ES6默认值的方法改写，简化了很多
export function dict(text, cfg = { prefix: '', type: 'text' }) {

    text = text.toUpperCase();

    if (!text) {
        console.error('传参错误：第一个参数至少传递一个翻译字符串');
        return 'ERROR';
    }

    let { prefix, type = "text" } = cfg;

    let result = dictionary[(prefix ? prefix + "_" : "") + text] || '未知类型';

    switch (type) {
        case 'text': {
            return result.text || result;
        } break;
        case 'badge': {
            return <Badge status={result.badge || 'warning'} text={result.text} />
        } break;
        case 'link': {
            return result.link;
        } break;
        default: {
            console.error('无法正确匹配，请检查传参类型');
            return text;
        }
    }

}
