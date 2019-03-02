import request from '../utils/request';
import { server } from '../utils/utils';
export async function searchWord(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getSensitiveWords&content=' + JSON.stringify({
            ...payload
        }),
    })
    // .then(res => {
    //     return res
    // }).catch(err => {
    //     console.error(err)
    // })
}
export async function deleteWord(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.removeSensitiveWord&content=' + JSON.stringify({
            ...payload
        }),
    })

}
export async function addWord(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addSensitiveWord&content=' + JSON.stringify({
            ...payload
        }),
    })

}
