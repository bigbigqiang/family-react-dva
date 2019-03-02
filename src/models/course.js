
import {
    queryCourseData,
    queryBookData,
    queryPlanData,
    setBookToCourse,
    setPlanToCourse,
    delOneCourse
} from '../services/course';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import lodash from 'lodash';

export default {

    namespace: 'course',

    state: {
        course_data: [],
        course_loading: false,
        book_data: [],
        book_loading: false,
        book_modal_show: false,
        book_modal_week: null,
        book_search_result: [],
        plan_init: [],
        plan_modal_show: false,
        plan_modal_week: null,
        set_plan_now: null,
        set_course_now: null,
        submit_btn_loading: false,
        search_loading: false,
    },

    effects: {
        // 已完成
        *fetchCourse({ payload }, { call, put }) {
            // TODO: 页面第一次打开，先查询，应该先request数据，然后payload
            // TODO: 页面点击查询之后，根据 大中小班，上下学期，精读，重新设置课程信息，
            yield put({
                type: 'changeCourseLoading',
                payload: true
            })
            const response = yield call(queryCourseData, payload);
            yield put({
                type: 'loadCourseData',
                payload: response
            })
            yield put({
                type: 'changeCourseLoading',
                payload: false
            })
        },
        *delCourse({ payload }, { call, put }) {
            const response = yield call(delOneCourse, payload.course_id);
            if (response.status == '1') {
                message.success(response.message)
                yield put({
                    type: 'fetchCourse',
                    payload: payload.values
                })
            }
        },
        // 已完成
        *searchBook({ payload }, { call, put }) {
            yield put({
                type: 'changeBookLoading',
                payload: true
            })
            const response = yield call(queryBookData, payload)
            // TODO: ↓ 正式调试的时候去掉,测试数据，不应该写在这里
            yield put({
                type: 'loadBookList',
                // payload: response,
                // TODO: 正式运行的时候改掉
                payload: response
            })
            yield put({
                type: 'changeBookLoading',
                payload: false
            })
        },
        *setBook({ payload }, { call, put }) {
            // TODO: 需要判断是否选择了课程 即 selectedBook
            // TODO: -2 缺少两个 reducers
            // 如果 selectedBook 符合要求，则 put hideBookModal fetchCourse ，并发送服务器
            // 如果 selectedBook 不符合要求，则 put error
            if (payload && payload.selectedBook && payload.selectedBook.key) {
                // 如果用户算则了书，才进入提交流程，否则报错 请先选择图书
                yield put({
                    type: 'submit_btn_loading',
                    payload: true
                })
                const response = yield call(setBookToCourse, payload);
                if (response) {
                    if (response.status == '1') {
                        message.success(response.message);
                    }
                    yield put({
                        type: 'hideBookModal'
                    })
                    yield put({
                        type: 'submit_btn_loading',
                        payload: false
                    })

                }
            } else {
                message.error('请先选择图书')
            }
            yield put({
                type: 'resetBookSelect'
            })
            yield put({
                type: 'fetchCourse',
                payload: payload.meta
            })
        },
        // 已完成
        *fetchPlan({ payload }, { call, put }) {
            // TODO: 取来已有的教案
            // console.log('收到查询教案参数', payload)
            const response = yield call(queryPlanData, payload)
            yield put({
                type: 'loadPlanData',
                payload: response
            })
            // console.log('2. 显示教案窗口', response)
            yield put({
                type: 'showPlanModal',
                payload: payload
            })
        },
        // ing
        *setPlan({ payload }, { call, put }) {
            const response = yield call(setPlanToCourse, payload)
            // return false;
            if (_.get(response, 'status') == '1') {
                message.success('设置教案成功')
                yield put({
                    type: 'hidePlanModal'
                })
            }
        }
    },

    reducers: {
        changeCourseLoading(state, action) {
            return {
                ...state,
                course_loading: action.payload
            }
        },
        loadCourseData(state, action) {
            // 页面初开，显示所有16次课程设置数据
            return {
                ...state,
                course_data: action.payload
            }
        },
        changeBookLoading(state, action) {
            return {
                ...state,
                book_loading: action.payload
            }
        },
        showBookModal(state, action) {
            // 显示 课程设置弹窗
            if (action.payload) {
                return {
                    ...state,
                    book_modal_show: true,
                    book_modal_week: action.payload.week || null,
                    set_course_now: action.payload.course_id || null
                }
            } else {
                return {
                    ...state,
                    book_modal_show: true,
                }
            }
        },
        hideBookModal(state, action) {
            // 隐藏 课程设置弹窗
            return {
                ...state,
                book_modal_show: false,
                book_modal_week: null,
                set_course_now: null
            }
        },
        resetBookSelect(state, action) {
            // 隐藏 课程设置弹窗
            return {
                ...state,
                set_course_now: null
            }
        },
        loadBookList(state, action) {
            return {
                ...state,
                book_data: action.payload
            }
        },
        showPlanModal(state, action) {
            // 显示 教案编辑弹窗
            return {
                ...state,
                plan_modal_show: true,
                plan_modal_week: action.payload.week,
                set_plan_now: action.payload.bookCode
            }
        },
        hidePlanModal(state, action) {
            // 隐藏 教案编辑弹窗

            // window.location.reload()
            return {
                ...state,
                plan_modal_show: false,
                plan_modal_week: null,
                set_plan_now: null,
                plan_init: null
            }
        },
        resetPlanSelect(state, action) {
            // 隐藏 课程设置弹窗
            return {
                ...state,
                plan_modal_week: null,
                set_plan_now: null
            }
        },
        loadPlanData(state, action) {
            // console.log('1. 获取当前教案数据', action.payload)
            return {
                ...state,
                plan_init: action.payload
            }
        },
        submit_btn_loading(state, action) {
            return {
                ...state,
                submit_btn_loading: action.payload
            }
        },
        changeSearchLoading(state, action) {
            return {
                ...state,
                search_loading: action.payload
            }
        }
    }
}
