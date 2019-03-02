import request from '../utils/request';
import { server } from '../utils/utils';

/**
 * @description 根据幼儿园Code和年级Code，获取指定幼儿园的所有班级列表，一般用于下拉选择框
 * kindergartenCode	是	String	幼儿园code
 * gradeCode	否	String	年级code 如果不传，则获取所有年级
 */
export async function getTheClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.listClassName&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 获取所有幼儿园或指定幼儿园  的班级列表
 * kindergartenCode	是	String	幼儿园code
 * graduateFlag     是  String  是否查询已毕业班级的flag
 */
export async function getClassList(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getClassList&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res
    }).catch(err => {
        console.error(err)
    })
}

/**
 * @description 升年级接口
 * oldClassCode	是	String	待升级的班级code
 * className	否	String	班级名称（当newClassCode 为空时，即其他选项时，必填）
 * newClassCode	否	String	目标班级code
 */
export async function requestRiseGrade(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.classUpgrade&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 获取升年级记录
* classCode	是	String	待升级的班级code
*/
export async function requestTheHistory(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.listUpgrade&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 获取指定班级的教师列表
* classCode	是	String	班级code
*/
export async function requestTeacherInClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.operaTeacherByClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}


/**
* @description 获取不在指定班级的教师列表
* classCode	string	是	班级code
* kindergartenCode	string	是	幼儿园code
* searchParam	string	否	搜索关键字
*/
export async function requestTeacherNotInClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getTeacherByClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 添加教师到班级
* teacherUidList 添加教师的Uid列表
*/
export async function addTeacherToClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.addTeacherToClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 从班级删除教师
* teacherUid 删除教师的uid 可以传递单个uid，也可以传递array
*/
export async function removeTeacherFromClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.removeTeacherFromClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 根据classCode删除班级
* classCode 删除教师的uid 可以传递单个uid，也可以传递array
*/
export async function deleteClassByclassCode(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 添加学生 编辑学生
*/
export async function addStudentToClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.operaUpdateStudent&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}

/**
* @description 添加学生 编辑学生
*/
export async function deleteStudentFromClass(payload) {
    return request(server.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.delectParentFromClass&content=' + JSON.stringify({
            ...payload
        }),
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err)
    })
}