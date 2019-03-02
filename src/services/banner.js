// Service
import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';

// status	String	否	状态 Offline下线 ,NORMAL:可用，EXCEPTION：草稿

export async function queryBannerList(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getBannerList&content=' + JSON.stringify({
            status: payload.status,
        }),
    }).then(res => {
        // if (res.data) {
        //     const result = res.data.map(item => {
        //         return {
        //             'key': item.id,
        //             'bannerImageUrl': item.bannerImageUrl,
        //             'banner_title': item.bannerTitle,
        //             'modify_time': item.updateTime,
        //             'status': item.status,
        //             'bannerCode': item.bannerCode,
        //             'type': item.type,
        //             'sortType': item.sortType,
        //             'canMove': item.canMove
        //         }
        //     })
        //     return result;
        // }
        return res.data;
    }).catch(err => {
        console.error(err)
    })
    // return request('/api/banner/bannerlist');
}

// 获取单个 Banner 图
export async function queryOneBanner(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getBannerInfo&content=' + JSON.stringify({
            bannerCode: payload
        }),
    }).then(res => {
       return res.data;
    }).catch(err => {
        console.error(err)
    })
    // return request('/api/banner/bannerlist');
}

// 编辑和新增 Banner 图
export async function setBanner(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.saveBanner&content=' + JSON.stringify(payload)
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
        return err
    })
}

// 更改Banner图的状态
export async function setBannerStatus(payload) {

    const args = {
        bannerCode: payload.bannerCode,
        status: payload.status
    }

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.saveBanner&content=' + JSON.stringify(args)
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })

}
// 更改Banner图的排序
export async function setBannerSort(payload) {

    const args = {
        bannerCode: payload.bannerCode,
        sequence: payload.sequence,
        status: payload.status
    }

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.moveBanner&content=' + JSON.stringify(args)
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })

}