import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';

//获取园所分成比例申请列表
export async function getKindergartenShareRatioAppliesService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getKindergartenShareRatioApplies&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取园所分成比例申请详情
export async function getKindergartenShareRatioApplyDetailsService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getKindergartenShareRatioApplyDetails&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//审核幼儿园分成比例
export async function auditKindergartenShareRatioApplyService(payload) {
    return request(server.url, {
        body: 'method=ella.home.auditKindergartenShareRatioApply&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取合伙人分成比例申请列表
export async function getPartnerShareRatioAppliesService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getPartnerShareRatioApplies&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取合伙人分成比例申请详情
export async function getPartnerShareRatioApplyDetailsService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getPartnerShareRatioApplyDetails&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//审核合伙人分成比例
export async function auditPartnerShareRatioApplyService(payload) {
    return request(server.url, {
        body: 'method=ella.home.auditPartnerShareRatioApply&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}


