import request from '../utils/request';
import { server } from '../utils/utils';
export async function getSearchCondition(payload) {
    console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.columnQueryBookListParams'
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function getBookList(payload) {
    console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.columnQueryBookList&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function getAudioList(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryBookAudioList&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function getSendHistoryList(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getEditorSendDynamics&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function toTop(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.topEditorSendDynamic&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function cannelToTop(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.cancelTopEditorSendDynamic&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function deleteInfo(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.operationDynamicDelete&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
export async function sendInfo(payload) {
    // console.log(payload);
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.saveEditorSendDynamic&content=' + JSON.stringify({
            ...payload
        }),
    })
        .then(res => {
            return res
        }).catch(err => {
            console.error(err)
        })
}
