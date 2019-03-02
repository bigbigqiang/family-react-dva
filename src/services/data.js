/**
 * Created by Zhaoyue on 2018/7/31
 */
import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd'



/**
 * @description 获取用户相关统计数据
 */
export async function requestDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryUserStatisticsByDate&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 导出用户相关统计数据
 */
export async function exportDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportUserStatistics&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}

/**
 * @description 按幼儿园分组统计相关数据
 */
export async function KindergartenData(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.statisticKindergartenData&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 根据幼儿园code和时间统计幼儿园数据
 */
export async function gartenData(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryClassDataStatisticByKGCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 根据幼儿园code和时间统计幼儿园数据
 */
export async function sendHomeTask(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryHomeTaskByClassCodeAndDate&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 根据班级code和时间段查询活跃家长
 */
export async function activeParent(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryActiveParentByClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 根据班级code和时间段统计家长完成作业数据
 */
export async function finishTask(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryParentFinishTaskByClassCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}

/**
* @description 根据幼儿园和时间查询活跃教师
*/
export async function activeTeachers(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryActiveTeacherByKG&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 根据幼儿园和时间查询发作业教师
 */
export async function sendTeachers(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryTeacherSendHomeTaskByKG&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 按幼儿园分组统计数据导出
 */
export async function exportKindergartenDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportStatisticKindergartenData&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * @description 导出统计单个幼儿园数据
 */
export async function exportClassData(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportClassDataStatisticByKGCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 合伙人统计列表 lyf 20180825
 */
export async function partnerListDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryPartnerStatistics&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res);
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 合伙人统计列表导出 lyf 20180825
 */
export async function exportPartnerDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportPartnerStatistics&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res);
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 幼儿园统计列表 lyf 20180825
 */
export async function kinderListDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.queryPartnerStatisticsByPartnerCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res);
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 幼儿园统计列表导出 lyf 20180825
 */
export async function exportKinderDatas(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportPartnerStatisticsByPartnerCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        // console.log(res);
        return res.data
    }).catch(err => {
        console.error(err)
    })

}
/**
 * 课程兴趣数据
 */
export async function queryCourseData(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.statisticsInterest&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}
/**
 * 课程兴趣 幼儿园总兴趣列表
 */
export async function queryCourseDataInterestList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.statisticsInterestByKGCode&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}
/**
 * 课程兴趣 导出
 */
export async function exportCourseData(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.exportStatisticsInterest&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.error(err)
    })
}