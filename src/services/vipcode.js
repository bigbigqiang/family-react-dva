import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';

/**
 * @description 批次 查询兑换码批次列表
 */
export async function serviceGetBatchList(payload) {
    // 192.168.10.100

    return request(server.url, {
        // return request('http://192.168.10.100:9000/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getVipBatchList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 创建 创建兑换码批次
 */
export async function createExcode(payload) {
    // 192.168.10.100

    return request(server.url, {
        // return request('http://192.168.10.100:9000/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.createVipCard&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}


/**
 * @description 批次，详情列表
 */
export async function serviceGetBatchDetailList(payload) {
    // 192.168.10.100

    return request(server.url, {
        // return request('http://192.168.10.100:9000/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getVipBatchDetail&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res)
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}


/**
 * @description 批次，详情列表
 */
export async function serviceGetUsedList(payload) {
    // 192.168.10.100

    return request(server.url, {
        // return request('http://192.168.10.100:9000/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getVipCardUsedList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res)
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}