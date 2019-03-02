import { request } from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
/**
 * @description 订单查询条件获取
 */
export async function queryParams() {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.orderQueryCondition',
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err))
}

/**
 * @description 订单导出
 */
export async function requestOutPut(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        body: 'method=ella.home.orderToExcel&content=' + JSON.stringify(payload),
    }).then(res => {
        console.log(res)
        return res;
    }).catch(err => console.error(err))
}

/**
 * @description 订单查询
 */
export async function queryOrderList(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryOrderByParam&content=' + JSON.stringify(payload),
    }).then(res => {
        return res.data;
        //data:{result,count}
    }).catch(err => console.error(err))
}
