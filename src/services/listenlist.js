/**
 * Created by Zhaoyue on 2018/11/6
 */
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
/**
 * 获取横幅列表
 */
export async function getLbListenList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getLbListenList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 *删除听单
 */
export async function deleteLbListen(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteLbListen&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })

}
