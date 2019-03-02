import request from '../utils/request';
import { server } from '../utils/utils';

/**
 * @description 查询所有运营人员列表
 */
export async function getOperatorList(payload) {

    return request(server.url, {
        body: 'method=ella.home.getOperatorList&content=' + JSON.stringify(payload),
    }).then(res => {

        return res.data;

    }).catch(err => console.error(err));

}


/**
 *删除运营人员
 */
export async function deleteOperator(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateOperatorStatus&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })

}

/**
 * @description 查找单个运营人员 Operator 基本信息
 * @param {string} uid 运营人员id
 */
export async function querryOneOperator(uid) {

    return request(server.url, {
        body: "method=ella.home.getOperatorInfo&content=" + JSON.stringify({
            uid: uid
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));
}

/**
 * @description 保存单个运营人员 Operator 
 */
export async function setOneOperator(payload) {

    return request(server.url, {
        body: "method=ella.home.saveAndUpdateOperator&content=" + JSON.stringify(payload),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}
