/**
 * Created by Zhaoyue on 2018/9/22
 */
import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';


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
       return res
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 编辑自定义栏目
 */
export async function editCustomColumn(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateCustomColumn&content=' + JSON.stringify({
            columnCode: payload.values.columnCode,
            columnTitle: payload.values.columnTitle,
            bookCodeList:payload.bookCodeList,
            columnStyle:payload.values.columnStyle,
            listType: payload.values.listType,
            targetDesc:payload.values.targetDesc,
            columnSourceNum:payload.values.columnSourceNum
        }),
    }).then(res => {
        return res
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
        body: 'method=ella.home.columnDetail&content=' + JSON.stringify({
            columnCode: payload.columnCode
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 获取查询条件
 */
export async function bookResultItem(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.columnQueryBookListParams&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}
/**
 * @description 获取图书列表
 */
export async function columnQueryBookList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.columnQueryBookList&content=' + JSON.stringify({
            bookName:payload.bookName,
            sendDate: payload.sendDate,
            publishCode:payload.publishCode,
            authorCode: payload.authorCode,
            gradeCode: payload.gradeCode,
            domainFirstCode:payload.domainFirstCode,
            domainSecondCode: payload.domainSecondCode,
            pageIndex:payload.pageIndex,
            pageSize:payload.pageSize
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}


