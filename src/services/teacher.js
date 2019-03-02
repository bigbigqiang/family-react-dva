import request from '../utils/request';
import { server } from '../utils/utils';

/**
 * @description 获取指定幼儿园的教师列表
 */
export async function requestTeachers(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getTeacherList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res)
        return res.data
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 获取指定教师的具体信息： 姓名、手机号、拥有的班级
 */
export async function requestTheTeacher(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getTeacherClassInfo&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 设置指定老师的具体信息： 姓名、手机号、拥有的班级
 */
export async function setTheTeacher(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateTeacherClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 根据uid直接删除某个老师，彻底删除
 */
export async function delTeacher(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteTeacher&content=' + JSON.stringify({
            uid: payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}

