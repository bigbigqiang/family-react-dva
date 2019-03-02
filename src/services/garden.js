import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
//获取幼儿园列表
export async function queryGardenList(payload) {

    return request(server.url, {
        body: 'method=ella.home.getKindergartenList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}
//获取幼儿园信息
export async function requestTheGardenInfo(payload) {

    return request(server.url, {
        body: 'method=ella.home.kindergartenHomePage&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err));
}

//获取幼儿园设置页数据
export async function queryGardenDetail(payload) {

    return request(server.url, {
        body: 'method=ella.home.getKindergartenByKGCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => console.error(err));
}

//设置幼儿园设置页数据
export async function updateGardenDetail(payload) {

    return request(server.url, {
        body: 'method=ella.home.saveKindergartenInfo&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // if (res) {
        //     if (res.status == 1) {
        //         message.success('修改成功!');
        //     }
        //     else message.error('修改失败!', res.message);
        // }
        return res;
    }).catch(err => console.error(err));
}

// 获取幼儿园审核数据
export async function queryGardenVerifyDetail(payload) {
    return request(server.url, {
        body: 'method=ella.home.getKindergartenCertification&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err));
}

//停启用幼儿园
export async function requestUpdateGardenStatus(payload) {

    return request(server.url, {
        body: 'method=ella.home.excellentKindergarten&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => console.error(err));
}

// 发送确认短信
export async function requestSendMessage(payload) {
    return request(server.url, {
        body: 'method=ella.home.sendMessage&content=' + JSON.stringify({
            ...payload
        })
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}

// 审核幼儿园
export async function requestVerifyGarden(payload) {
    console.log(payload)
    return request(server.url, {
        body: 'method=ella.home.certificateKindergarten&content=' + JSON.stringify({
            ...payload
        })
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}
