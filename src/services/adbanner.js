/**
 * Created by Zhaoyue on 2018/9/22
 */
// Service
import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
import lodash from 'lodash';


/**
 * 获取横幅列表
 */
export async function getAdList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getAdList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 删除广告横幅
 */
export async function deleteAdList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteAd&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res);
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 新增广告横幅
 */
export async function addAds(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.saveAndUpdateAd&content=' + JSON.stringify({...payload})
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
        return err
    })
}
/**
 * 获取广告横幅详情
 */
export async function getAdDetails(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getAdDetails&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if(res){
            if(res.status="1"){
                return res.data
            }else{
                message.error('获取广告横幅失败!');
            }
        }else{
            message.error('获取广告横幅失败!');
        }
    }).catch(err => {
        console.error(err)
    })

}
