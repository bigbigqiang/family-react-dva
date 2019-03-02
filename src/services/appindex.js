/**
 * 2018-09-17 by JaySG
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
        body: 'method=ella.home.getHomePageList&content=' + JSON.stringify({
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
        body: 'method=ella.home.moveHomePageMoudle&content=' + JSON.stringify({
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
        body: 'method=ella.home.deleteHomeMoudle&content=' + JSON.stringify({
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
        body: 'method=ella.home.publish&content=' + JSON.stringify({
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
        body: 'method=ella.home.preview&content=' + JSON.stringify({
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
        body: 'method=ella.home.getUsableAds&content=' + JSON.stringify({
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
        body: 'method=ella.home.getUsableCustoms&content=' + JSON.stringify({
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
        body: 'method=ella.home.addAdToHomePage&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 插入栏目 首页模块
 */
export async function addCustomToHomePage(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addCustomToHomePage&content=' + JSON.stringify({
            ...payload
        }),
    }).catch(err => {
        console.error(err)
    })
}
