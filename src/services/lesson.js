// import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
// import lodash from 'lodash';


/**
 * @description 课程表 查询
 */
export async function queryLessonData(payload) {

    // 参数过滤
    let gC;
    if (payload.gradeCode.indexOf('G') !== -1) {
        gC = payload.gradeCode;
    } else {
        gC = {
            "2": "G0000000001",
            "3": "G0000000002",
            "4": "G0000000003",
        }[payload.gradeCode + ""];
    }
    // console.log(gC)

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryScheduleList&content=' + JSON.stringify({
            scheduleTime: payload.scheduleTime,
            gradeCode: gC,
            kindergartenCode: payload.kindergartenCode, //scheduleType=custom 必填
            classCode: payload.classCode,               //scheduleType=custom 必填
            scheduleType: payload.scheduleType          //default/custom 默认课表/自定义课表
        }),
    }).then(res => {
        if (res.status == '1') {
            return res.data.scheduleList;
        } else {
            if (res.code === '50000000') {
                message.error('获取课程表:请选择幼儿园和班级!')
            } else {
                message.error(res.message)
            }
        }
    }).catch(err => console.error(err))
}
/**
 * @description 默认课程表 添加图书
 */
export async function sqladdToScheduleDef(payload) {

    // 参数过滤
    let gC;
    if (payload.gradeCode.indexOf('G') !== -1) {
        gC = payload.gradeCode;
    } else {
        gC = {
            "2": "G0000000001",
            "3": "G0000000002",
            "4": "G0000000003",
        }[payload.gradeCode + ""];
    }
    // console.log(gC)

    payload.gradeCode = gC;

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addToScheduleDef&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('添加成功!')
        }
    }).catch(err => console.error(err))
}
/**
 * @description 自定义课程表 添加图书
 */
export async function sqladdToSchedule(payload) {
    // console.log(payload)
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addToSchedule&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('添加成功!')
        }
    }).catch(err => console.error(err))
}
/**
 * @description 默认课程表 删除图书
 */
export async function sqldelFromScheduleDef(payload) {

    // 参数过滤
    let gC;
    if (payload.gradeCode.indexOf('G') !== -1) {
        gC = payload.gradeCode;
    } else {
        gC = {
            "2": "G0000000001",
            "3": "G0000000002",
            "4": "G0000000003",
        }[payload.gradeCode + ""];
    }
    payload.gradeCode = gC;

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.delFromScheduleDef&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('取消选择成功!')
        }
    }).catch(err => console.error(err))
}
/**
 * @description 自定义课程表 删除图书
 */
export async function sqldelFromSchedule(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.delFromSchedule&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('取消选择成功!')
        }
    }).catch(err => console.error(err))
}
/**
 * @description 查询教案 实际使用的是 获取图书详情接口
 * 此接口返回数据与获取图书列表接口的部分字段冗余 只取用教案相关4个字段
 */
export async function queryPlan(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getCourseInfo&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            return res.data;
        }
    }).catch(err => console.error(err))
}
/**
 * @description 设置教案
 */

export async function sqlsetPlan(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateCourseBook&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('修改教案成功')
        }
    }).catch(err => console.error(err))
}
/**
 * @description 查询作业列表
 */
export async function queryWorkList(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getBookTaskList&content=' + JSON.stringify(payload),
    }).then(res => {
        // console.log(res)
        if (res.status == '1') {
            return res.data;
        }
    }).catch(err => console.error(err))
}
/**
 * @description 设置图书作业信息
 */
export async function sqlsetBookWork(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateBookTask&content=' + JSON.stringify(payload),
    }).then(res => {
        // console.log(res)
        if (res.status == '1') {
            message.success('作业设置成功!')
        }
    }).catch(err => console.error(err))
}

/**
 * @description 获取出版社列表operation.box.publishList 领域列表operation.box.bookDomainClassList 主题分类列表operation.box.bookTopicClassList
 */
export async function queryBookSearchCongfig(payload) {

    return request(server.bookurl, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.operation.boxSearchList&content=' + JSON.stringify({
            groupId: payload.groupId,
            type: "AUTO_BOX"
        }),
    }).then(res => {
        if (res.status == '1') {
            return res.data;
        } else {
            switch (payload.groupId) {
                case 'operation.box.publishList':
                    message.error('获取出版社列表失败!');
                    break;
                case 'operation.box.bookDomainClassList':
                    message.error('获取领域列表失败!');
                    break;
                case 'operation.box.bookTopicClassList':
                    message.error('获取主题分类列表失败!');
                    break;
                case 'operation.box.bookGradeList':
                    message.error('获取年级列表失败!');
                    break;
            }
        }
    }).catch(err => console.error(err))
}

/**
 * @description 获取图书列表
 */
export async function queryBookList(payload) {


    // 参数过滤
    let gradeCode = payload.scheduleParam.gradeCode;
    let gC;
    if (gradeCode.indexOf('G') !== -1) {
        gC = gradeCode;
    } else {
        gC = {
            "2": "G0000000001",
            "3": "G0000000002",
            "4": "G0000000003",
        }[gradeCode + ""];
    }

    payload.scheduleParam.gradeCode = gC;

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.bookSearch&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            return res.data;
        }
    }).catch(err => console.error(err))
}
/**
 * @description 根据幼儿园和年级获取班级信息
 */
export async function queryClassListByGrade(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.listClassName&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            return res.data;
        }
    }).catch(err => console.error(err))
}
/**
 * @description 恢复至默认课程表
 */
export async function recoverToDef(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.recoverToDef&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('恢复完成!')
        } else {
            if (res.code === '50000000') {
                message.error('恢复默认课程表:请选择幼儿园和班级!')
            }
        }
    }).catch(err => console.error(err))
}
/**
 * @description 获取代理商列表
 */
export async function queryKindergartenList(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getKindergartenList&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            return res.data.kindergartenList
        }
    }).catch(err => console.error(err))
}
/**
 * @description 恢复图书默认教案
 */
export async function recoverPlan(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.recoveryCourseBook&content=' + JSON.stringify(payload),
    }).then(res => {
        if (res.status == '1') {
            message.success('已恢复图书默认教案!');
            return true;
        }
    }).catch(err => console.error(err))
}
