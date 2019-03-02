import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'

/**
 * @description 查询所有代理商列表 不用传参
 */
export async function queryAccountData(payload) {

    return request(server.url, {
        body: 'method=ella.home.getPartnerList&content=' + JSON.stringify({
            searchParam: _.get(payload, 'keywords', ''), // TODO: 这个地方后端还在修改
            cityManagerUid: _.get(payload, 'cityManagerUid', '')
        }),
    }).then(res => {

        return res.data;

    }).catch(err => console.error(err));

}

/**
 * @description 查找单个代理商 account 基本信息
 * @param {string} uid 代理商id
 */
export async function querryOneAccount(uid) {

    return request(server.url, {
        body: "method=ella.home.getPartnerInfo&content=" + JSON.stringify({
            uid: uid,
            channelCode: 'BSS'
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));
}

export async function setOneAccount(payload) {

    payload.province = payload.geoLocation[0];
    payload.city = payload.geoLocation[1];
    payload.contractBeginTime = payload.cantractTime[0].valueOf();
    payload.contractEndTime = payload.cantractTime[1].valueOf();

    if (!payload.uid) {
        // 如果存在，则是编辑 ； 如果不存在，则是添加
        delete payload.uid;
        delete payload.cantractTime;
        delete payload.geoLocation;
    }

    return request(server.url, {
        body: "method=ella.home.savePartner&content=" + JSON.stringify(payload),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}


/**
 *
 * @param {Array} stopArr 需要停用的用户的uid数组
 */
export async function changeSomeAccount(args) {
    return request(server.url, {
        body: "method=ella.home.deletePartner&content=" + JSON.stringify({
            uidList: args.uid,
            state: args.status
        }),
    }).then(res => {
        // console.log(res)
        if (args.status == 'NORMAL')
            message.success('启用成功')
        else if (args.status == 'EXCEPTION')
            message.success('停用成功')
        return res;
    }).catch(err => console.error(err))
}

/**
 *
 * @param {string} phone 需要查询的手机号码
 */
export async function requestAnyAccount(args) {
    return request(server.url, {
        body: "method=ella.home.customerSearch&content=" + JSON.stringify(args),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}

/**
 *
 * @param {string} uid 需要注销的账户uid
 */
export async function requestStopAccount(args) {
    return request(server.url, {
        body: "method=ella.home.customerLogOut&content=" + JSON.stringify(args),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}

/**
 *
 * @param 无 获取城市经理下拉框
 */

export async function getCityManagerList(args) {
    return request(server.url, {
        body: "method=ella.home.getCityManagerComboBox"
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}
