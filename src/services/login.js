import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { hex_md5 } from '../utils/Md5'
import moment from 'moment'
import { message } from 'antd'

export async function EllaLogin(payload) {

    // TODO: 上线之前需要改过来
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.login&content=' + JSON.stringify({
            customerName: payload.userName,
            password: hex_md5(payload.password),
            loginType: 'BSS',
            resource: 'BSS'
        }),

    }).then(res => {

        if (res.status && res.status == '1') {
            message.success(res.message)
        }

        return {
            ...res,
            type: payload.type,
        }

    }).catch(err => {
        message.error('服务器异常!')
        console.error(err)
    });

}

