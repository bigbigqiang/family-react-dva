import request from '../utils/request';
import { server } from '../utils/utils';

export async function getDailyInfoList(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getDynamicStatisticsDetail&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function getDailyChartInfoList(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getDynamicStatistics&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function getDetailList(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getDynamicByKGCode&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function deleteInfo(payload) {
    console.log(payload)
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.operationDynamicDelete&content=' + JSON.stringify({
            ...payload
        }),
    })

}
