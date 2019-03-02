import { request } from '../utils/request';
import { server } from '../utils/utils';

export async function getTheCode(payload) {
    return request(`${server.serverPath}/rest/api/getUserCheckCode?mobile=${payload}`, {
        method: 'GET',
        'Content-Type': 'application/json;charset=UTF-8'
    })
        .then(res => {
            return res.data;
        }).catch(err => {
            console.error(err)
        })
}
