/**
 * Created by Zhaoyue on 2018/11/6
 */
import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';


/**
 * @description 听单列表
 */
export async function queryByLbListenCode(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryByLbListenCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 听单详情
 */
export async function lbListenDetail(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.lbListenDetail&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 音频列表条件
 */
export async function queryBookAudioParams(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryBookAudioParams&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 音频查询列表
 */
export async function queryBookAudioList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryBookAudioList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 修改听单
 */
export async function updateLbListen(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateLbListen&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 添加听书书单
 */
export async function addLbListen(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addLbListen&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}

