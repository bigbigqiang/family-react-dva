// Service
import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { message } from 'antd';
import { EllaInfo } from '../common/ellainfo'
import lodash from 'lodash';
const gradeMap = {
    '1': 'G0000000001',
    '2': 'G0000000002',
    '3': 'G0000000003',
}

const courseMap = {
    "1": 'IN',
    "2": 'OUT'
}

const semesterMap = {
    '1': 'LASTSEMESTER ',
    '2': 'NEXTSEMESTER',
}

/**
 * @description 查询16周课程设置
 * @param {string} payload
 *      1. undefined 直接查询默认数据 ：大班 上学期 精读
 *      2. object 查询条件
 */
export async function queryCourseData(payload) {

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getCourseList&content=' + JSON.stringify({
            courseType: courseMap[payload.read],
            gradeCode: gradeMap[payload.class_type],
            semester: semesterMap[payload.term],
        }),
    }).then(res => {
        if (res.status == '1') {
            if (_.get(res, 'data.courseDetailVos')) {

                var result = res.data.courseDetailVos.map(item => {
                    return {
                        'course_id': item.courseCode,
                        'course_title': item.bookName,
                        'has_plan': item.flagTeachingPlan,
                        'lesson_pan': item.state,
                        'book_code': item.bookCode,  // 编辑教案需要传递
                        'id': item.id,               // 设置Book用
                        'week_number': item.weekNum, // 设置Book用
                        'courseType': res.data.courseType
                    }
                })

                var fullresult = Array.apply(null, Array(EllaInfo.courseWeekNumber)).map((item, index) => {
                    return { 'week_number': index + 1 }
                })
                result.map((item, index) => {
                    fullresult[item.week_number - 1] = item;
                })
                return fullresult;

            }
        }
    }).catch(err => console.error(err))
}

/**
 * @description 删除单个课表
 * @param {sting} payload 课程 id
 */
export async function delOneCourse(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.deleteCourse&content=' + JSON.stringify({
            id: payload.course_id,
        })
    }).then(res => {
        // console.log(res)
        return res;
    }).catch(err => {
        console.warn(err)
    })
}

/**
 * @description 查询书籍列表，根据courseType
*  key: index + '',
*  book_name: `《${faker.lorem.slug()}》`,
*  stack_time: '2017-10-18',
*  book_status: '已上架'
* @param {*} payload
*/
export async function queryBookData(payload) {

    const data = {};

    if (payload) {
        const { courseType, book } = payload;
        if (courseType) {
            data.courseType = courseMap[courseType]
        }
        if (book) {
            data.bookName = book
        }
    }

    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getCourseBookList&content=' + JSON.stringify({
            ...data
        }),
    }).then(res => {
        if (res.data) {
            const result = res.data.map(item => {
                return {
                    'key': item.bookCode,
                    'book_name': item.bookName,
                    'stack_time': item.createTime,
                    'book_status': item.state
                }
            })
            return result;
        }
    }).catch(err => console.error(err))
}

export async function queryPlanData(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.getCourseInfo&content=' + JSON.stringify({
            bookCode: payload.bookCode
        }),
    }).then(res => {
        if (res.data) {
            return {
                'teach_aim': res.data.target,
                'teach_prepare': res.data.preparation,
                'teach_flow': res.data.process,
                'teach_extend': res.data.activityExtension
            }
        }
    }).catch(err => console.error(err))
}

/**
 * @param {*} payload
 */
export async function setBookToCourse(payload) {
    // console.log(payload.set_course_now)
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateCourseDetail&content=' + JSON.stringify({
            courseType: courseMap[payload.meta.read],// 课内 课外 精读 课外
            gradeCode: gradeMap[payload.meta.class_type],
            semester: semesterMap[payload.meta.term],
            id: payload.set_course_now || null,
            bookCode: payload.selectedBook.key,
            weekNum: payload.week
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}

/**
 *
bookCode            String	是	书的code
target              String	是	教学目标
preparation         String	是	教学准备
process             String	是	教学流程
activityExtension	String	是	活动延伸
 * @param {*} payload
 */
export async function setPlanToCourse(payload) {
    return request(server.url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'method=ella.home.updateCourseBook&content=' + JSON.stringify({
            bookCode: payload.set_plan_now,
            target: payload.data.teach_aim,
            preparation: payload.data.teach_prepare,
            process: payload.data.teach_flow,
            activityExtension: payload.data.teach_extend,
        }),
    }).then(res => {
        return res;
    }).catch(err => console.error(err))
}
