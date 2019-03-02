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
 * 获取自定义栏目列表
 */
export async function customColumnList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.customColumnList&content=' + JSON.stringify({
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
 * 删除自定义栏目
 */
export async function deleteColumnList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteCustomColumn&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if(res&&res.status==1){
            message.success('删除成功!');
        }else{
            message.error(res.message);
        }
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 添加自定义栏目
 */
export async function addCustomColumn(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addCustomColumn&content=' + JSON.stringify({
            columnTitle: payload.values.columnTitle,
            bookCodeList:payload.bookCodeList,
            columnStyle:payload.values.columnStyle,
            listType: payload.values.listType,
            targetDesc:payload.values.targetDesc,
            columnSourceNum:payload.values.columnSourceNum
        }),
    }).then(res => {
        // console.log(res)
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 自定义栏目详情
 */
export async function updateCustomColumn(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateCustomColumn&content=' + JSON.stringify({
            columnCode: payload.columnCode
        }),
    }).then(res => {

    }).catch(err => {
        console.error(err)
    })
}