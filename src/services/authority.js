import request from '../utils/request';
import { server } from '../utils/utils';
import lodash from 'lodash';
import { message } from 'antd';

/**
 * @description 请求成员列表数据
 * @param {string} searchParam 搜索条件，为空则返回所有列表数据
 */
export async function requestAccounts(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.memberList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 请求角色列表数据
 * @param {string} searchParam 搜索条件，为空则返回所有列表数据
 */
export async function requestRoles(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.selectRoleList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 根据code(kindergartenCode 或者 uid)请求指定用户的角色信息
 * @param {string} uniqueCode code
 * @param {string} uniqueType 用户类型，HEADMASTER为园所，OTHER为运营人员
 */
export async function requestTheRole(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.listUserRole&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 设置指定用户的角色信息
 * @param {string} uniqueCode code
 * @param {string} uniqueType 用户类型，HEADMASTER为园所，OTHER为运营人员
 * @param {array} roleCodeList 角色code数组
 */
export async function setTheRole(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.assignRole&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 获取空的权限信息，用于新增用户权限
 */
export async function requestAuthorityTree() {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.selectMenuList',
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 获取空的权限信息，用于新增用户权限
 */
export async function requestTheAuthority(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.selectRoleInfo&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}


/**
 * @description 第一步，新增或修改角色
 */
export async function setRole(payload) {
    // console.log(fullContent);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateRole&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @description 第二步，分配权限
 */
export async function setAuthority(payload) {
    console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.assignPermissions&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}

export async function deleteRole(payload) {
    console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteRole&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
    })
}
