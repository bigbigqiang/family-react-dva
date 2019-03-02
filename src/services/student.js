import request from '../utils/request';
import { server } from '../utils/utils';

/**
 * @description 根据班级Code获取学生列表
 * classCode string
 */
export async function getStudentsByClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.operaStudentByClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}