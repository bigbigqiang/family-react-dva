import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';

/**
 * @description 批次 查询vip赠送批次
 */
export async function serviceGetBatchList(payload) {
    // 192.168.10.100

    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getSendHomeVipList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 赠送 弹窗 ella.home.sendHomeVip
 */
export async function servicePresentVip(payload) {
    // 192.168.10.100

    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.sendHomeVip&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 详情 查询单个赠送批次的 详情
 */
export async function serviceGetDetailList(payload) {
    // 192.168.10.100

    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getSendHomeVipHistory&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}