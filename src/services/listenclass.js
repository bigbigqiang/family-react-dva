/**
 * Created by JaySG on 2018/10/23
 */
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'

export async function getListenList(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getLbSortList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));

}
/**
 * 获取分类列表详情
 */
export async function sortDetail(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getLbSortDetail&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if(res){
            if(res.status="1"){
                return res.data
            }else{
                message.error('获取分类详情失败!');
            }
        }else{
            message.error('获取分类详情失败!');
        }
    }).catch(err => console.error(err));

}
/**
 * 获取分类条件列表
 */

export async function getSortParams(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getTargetSelector&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));

}
/**
 * 修改分类
 */

export async function updateSort(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.editLbSort&content=' + JSON.stringify({
            ...payload
        })
    }).then(res => {
        // console.log(res)
        if(res){
            if(res.status=='1'){

            }else{
                message.error(res.message);
            }
        }
    }).catch(err => console.error(err));

}
