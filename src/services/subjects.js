import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';

/**
 * @description 将html代码内容发往服务器，生成html静态文件，并返回静态页面地址
 * @param {string} fullContent
 */
export async function generateTargetPage(fullContent) {
    // console.log(fullContent);
    return request(server.htmlUploadUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'content=' + JSON.stringify({
            fileContent: encodeURIComponent(fullContent)
        })
    }).then(res => {
        return res.data;
    }).catch(err => {
        // console.log(err)
    })
}

/**
 * @description 新增，或者编辑一个专题，由editContent是否有topicCode来决定
 * @param {object} 整个专题的内容，发往服务器
 * 19773v099u.imwork.net:18209
 */
export async function serviceSetSubject(editContent) {
    return request(server.url, {
        // return request('http://19773v099u.imwork.net:18209/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.saveOrUpdateTopic&content=' + JSON.stringify({
            ...editContent
        }),
    }).then(res => {
        if (editContent.publishFlag == "DRAFT")
            message.success('草稿保存成功');
        else if (editContent.publishFlag == "PUBLISH_YES")
            message.success('专题新增成功');

        console.log(res);
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 根据专题码查询一个专题的内容，以供编辑
 * @param {string} topicCode 专题码
 */
export async function serviceGetSubject(topicCode) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getTopicInfo&content=' + JSON.stringify({
            topicCode
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
        message.error('获取专题列表失败!')
    })
}

/**
 * @description 查询专题列表
 */
export async function serviceGetList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.topicList&content=' + JSON.stringify({
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
 * @description 查询图书数据
 */
export async function serviceGetBooks(payload) {
    // 192.168.10.100
    return request(server.url, {
        // return request('http://192.168.10.100:9000/rest/api/service', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryLibBookList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log('所有图书', res)
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 专题列表，上线或下线一条专题
 */
export async function serviceModifyState(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.topicPublish&content=' + JSON.stringify({
            publishFlag: payload.publishFlag,
            topicCode: payload.topicCode
        }),
    }).then(res => {
        // console.log(res)
    }).catch(err => {
        console.error(err)
    })
}


/**
 * @description 专题列表，调整排序
 */
export async function moveSpecialTopic(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.moveSpecialTopic&content=' + JSON.stringify({
            moveCode: payload.moveCode,
            moveType: payload.moveType,
            status: payload.status
        }),
    }).then(res => {
        // console.log(res)
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
            bookCodeList: payload.bookCodeList,
            columnStyle: payload.values.columnStyle,
            listType: payload.values.listType,
            targetDesc: payload.values.targetDesc,
            columnSourceNum: payload.values.columnSourceNum
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
        body: 'method=ella.home.columnDetail&content=' + JSON.stringify({
            columnCode: payload.columnCode
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}


