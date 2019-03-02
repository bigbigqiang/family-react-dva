import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';

//获取公司报表
export async function getCorpReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getCorpReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//导出公司报表
export async function exportCorpReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.exportCorpReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取合伙人报表
export async function getPartnerReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getPartnerReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//导出合伙人报表
export async function exportPartnerReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.exportPartnerReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取幼儿园报表
export async function getKindergartenReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getKindergartenReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//导出幼儿园报表
export async function exportKindergartenReportFormService(payload) {
    return request(server.url, {
        body: 'method=ella.home.exportKindergartenReportForm&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

//获取合伙人比例调整详情
export async function getPartnerShareRatiosService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getPartnerShareRatios&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

// 设置合伙人分成比例
export async function editPartnerShareRatioService(payload) {
    return request(server.url, {
        body: 'method=ella.home.editPartnerShareRatio&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err));
}

//获取幼儿园比例调整详情
export async function getKindergartenShareRatiosService(payload) {
    return request(server.url, {
        body: 'method=ella.home.getKindergartenShareRatios&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}

// 设置幼儿园分成比例
export async function editKindergartenShareRatioService(payload) {
    return request(server.url, {
        body: 'method=ella.home.editKindergartenShareRatio&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err));
}

// 设置幼儿园分成比例
export async function editKindergartenShareRatioShowService(payload) {
    return request(server.url, {
        body: 'method=ella.home.editKindergartenShareRatioShow&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        if (res.data) {
            return res.data;
        }
    }).catch(err => console.error(err));
}


