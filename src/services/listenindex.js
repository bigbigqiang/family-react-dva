/**
 * 2018-10-23 by JaySG
 */
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'

/**
 * @description 获取首页模块列表
 */
export async function queryList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.lbAppHomeList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 排序 首页模块
 */
export async function updateModuleOrder(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.moveLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 置顶
 */
export async function topLbAppHome(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.topLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 显隐 首页模块
 */
export async function updateModuleVisible(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.editHomeMoudleVisible&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 删除 首页模块
 */
export async function deleteModule(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res && res.status == 1) {
            message.success('删除成功!');
        } else { }
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 发布 首页模块
 */
export async function publish(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.publishAppHomeData&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res && res.status == 1) {
            message.success('发布成功!');
        }
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 预览 首页模块
 */
export async function preview(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.previewLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res && res.status == 1) {
            return res.data;
        }
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 获取 广告列表
 */
export async function queryADList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getUnshowLbAdList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res && res.status == 1) {
            return res.data;
        }
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 获取 自定义栏目列表
 */
export async function queryCusList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getUnShowLbListenList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res && res.status == 1) {
            return res.data;
        }
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 插入广告 首页模块
 */
export async function addAdToHomePage(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addLbAdToLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 插入书单 首页模块
 */
export async function addCustomToHomePage(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addLbListenToLbAppHome&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })
}
