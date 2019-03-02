import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'

/**
 * @description 查询所有大区经理列表
 */
export async function getRegionalManagerList(payload) {

    return request(server.url, {
        body: 'method=ella.home.getRegionalManagerList&content=' + JSON.stringify(payload),
    }).then(res => {

        return res.data;

    }).catch(err => console.error(err));

}

/**
 * @description 查找单个大区经理 regionalManager 基本信息
 * @param {string} uid 代理商id
 */
export async function querryOneRegionalManager(uid) {

    return request(server.url, {
        body: "method=ella.home.getRegionalManagerInfo&content=" + JSON.stringify({
            uid: uid
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));
}

export async function setOneRegionalManager(payload) {
    return request(server.url, {
        body: "method=ella.home.saveAndUpdateRegionalManager&content=" + JSON.stringify(payload),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}


/**
 *
 * @param {str} stopStr 需要停用的用户的uid
 */
export async function changeSomeRegionalManager(args) {
    return request(server.url, {
        body: "method=ella.home.updateRegionalManagerStatus&content=" + JSON.stringify(args),
    }).then(res => {
        if (args.status == 'NORMAL')
            message.success('启用成功')
        else if (args.status == 'EXCEPTION')
            message.success('停用成功')
        return res;
    }).catch(err => console.error(err))
}
