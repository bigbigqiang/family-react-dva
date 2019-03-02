import { requestTeachers, requestTheTeacher, setTheTeacher, delTeacher } from '../services/teacher';
import { getTheClass } from '../services/class';
import { queryGardenList } from '../services/garden';
import { message } from 'antd';

export default {
    namespace: 'teacher',

    state: {
        listLoading: false,
        modalLoading: false,
        showModal: false,
        teacherData: [],
        theTeacher: {},
        theGarden: {}, // 幼儿园列表
        classData: []
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })

            if (payload != null) {
                const response = yield call(requestTeachers, payload)
                if (response) {
                    yield put({
                        type: 'setData',
                        payload: {
                            teacherData: response
                        }
                    })
                }
            } else {
                yield put({
                    type: 'setData',
                    payload: {
                        teacherData: []
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *searchTheGarden({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(queryGardenList, payload)
            yield put({
                type: 'setData',
                payload: {
                    theGarden: response
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *getTheTeacherInfo({ payload }, { call, put }) {
            console.log(payload)
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const grade1 = yield call(getTheClass, {
                kindergartenCode: payload.gardenCode,
                gradeCode: 'G0000000001'
            })
            const grade2 = yield call(getTheClass, {
                kindergartenCode: payload.gardenCode,
                gradeCode: 'G0000000002'
            })
            const grade3 = yield call(getTheClass, {
                kindergartenCode: payload.gardenCode,
                gradeCode: 'G0000000003'
            })
            let teacherInfo = {};
            if (payload.uid) {
                teacherInfo = yield call(requestTheTeacher, payload)
            }
            yield put({
                type: 'setData',
                payload: {
                    showModal: true,
                    theTeacher: { grade1: grade1.data || [], grade2: grade2.data || [], grade3: grade3.data || [], teacherInfo: teacherInfo || [] }
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *setTheTeacher({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    modalLoading: true
                }
            })
            const response = yield call(setTheTeacher, payload)
            if (response.status === '1') {
                message.success('编辑/添加教师成功')
            }
            // 添加或编辑教师之后，重新请求最新的教师列表
            yield put({
                type: 'fetch',
                payload: {
                    kindergartenCode: payload.kindergartenCode
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    showModal: false,
                    modalLoading: false
                }
            })
        },
        *deleteTheTeacher({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(delTeacher, payload.uid)
            if (response.status === '1') {
                message.success('删除教师成功')
            } else {
                message.error('删除教师失败')
            }
            yield put({
                type: 'fetch',
                payload: {
                    kindergartenCode: payload.kindergartenCode
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        }
    },

    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }
}
