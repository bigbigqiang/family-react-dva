import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'

/**
 * @description 查询所有城市经理列表
 */
export async function getCityManagerList(payload) {

    return request(server.url, {
        body: 'method=ella.home.getCityManagerList&content=' + JSON.stringify(payload),
    }).then(res => {

        return res.data;

    }).catch(err => console.error(err));

}

/**
 * @description 查找单个城市经理 cityManager 基本信息
 * @param {string} uid 代理商id
 */
export async function querryOneCityManager(uid) {

    return request(server.url, {
        body: "method=ella.home.getCityManagerInfo&content=" + JSON.stringify({
            uid: uid
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));
}

export async function setOneCityManager(payload) {
    return request(server.url, {
        body: "method=ella.home.saveAndUpdateCityManager&content=" + JSON.stringify(payload),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}


/**
 *
 * @param {str} stopStr 需要停用的用户的uid
 */
export async function changeSomeCityManager(args) {
    return request(server.url, {
        body: "method=ella.home.updateCityManagerStatus&content=" + JSON.stringify(args),
    }).then(res => {
        if (args.status == 'NORMAL')
            message.success('启用成功')
        else if (args.status == 'EXCEPTION')
            message.success('停用成功')
        return res;
    }).catch(err => console.error(err))
}

/**
 *
 * @param 无 获取大区经理下拉框
 */

export async function getRegionalManagerList(args) {
    return request(server.url, {
        body: "method=ella.home.getRegionalManagerComboBox"
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}
