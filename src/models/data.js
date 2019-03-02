/**
 * Created by Zhaoyue on 2018/7/31
 */

import moment from 'moment'
import { message } from 'antd'
import {
    requestDatas,
    exportDatas,
    KindergartenData,
    gartenData,
    sendHomeTask,
    activeParent,
    finishTask,
    activeTeachers,
    sendTeachers,
    exportKindergartenDatas,
    exportClassData,
    partnerListDatas,
    exportPartnerDatas,
    kinderListDatas,
    exportKinderDatas,
    queryCourseData,
    queryCourseDataInterestList,
    exportCourseData
} from '../services/data';

const DateFormat = 'YYYY/MM/DD';
const Today = new Date();


export default {

    namespace: 'data',

    state: {
        listData: [],
        formloading: false,
        showAdd: false,
        nowEditCode: null,
        button_loading: false,
        listLoading: false,
        modalLoading: false,
        showModal: false,
        showSendTeacher: false,
        courseData: [],
        courseDataTotal: 0,
        interestData: [],
        interestDataTotal: 0,
        courseDataFileUrl: '',
        Kindergartens: null,
        useDataCache: null,
        partnerDataCache: null
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(requestDatas, payload)
                if (response) {
                    yield put({
                        type: 'loadTeacher',
                        payload: response
                    })
                }
            } else {
                yield put({
                    type: 'loadTeacher',
                    payload: []
                })
            }
            yield put({
                type: 'listLoading',
                payload: false
            })
        },
        *exportDatas({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(exportDatas, payload)
                if (response) {
                    yield put({
                        type: 'exportList',
                        payload: response
                    })
                }
            } else {
                yield put({
                    type: 'exportList',
                    payload: []
                })
            }
            yield put({
                type: 'listLoading',
                payload: false
            })
        },
        *KindergartenData({ payload }, { call, put, select }) {

            const { useDataCache } = yield select(state => state.data)

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })

            const response = yield call(KindergartenData, {
                startDate: moment().startOf('month').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                pageIndex: 1,
                pageSize: 10,
                ...useDataCache,
                ...payload
            })

            yield put({
                type: 'setData',
                payload: {
                    Kindergartens: response,
                    listLoading: false,
                    useDataCache: {
                        ...useDataCache,
                        ...payload
                    }
                }
            })
        },
        *garenDetailData({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(gartenData, payload)
                if (response) {
                    yield put({
                        type: 'gartenDetail',
                        payload: response
                    })
                } else {
                    yield put({
                        type: 'gartenDetail',
                        payload: []
                    })
                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })
        },
        *sendTaskData({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(sendHomeTask, payload);
                if (response) {
                    yield put({
                        type: 'loadClassStudent',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *activeParents({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(activeParent, payload);
                if (response) {
                    yield put({
                        type: 'activeMoms',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *finishTask({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(finishTask, payload);
                if (response) {
                    yield put({
                        type: 'finishMoms',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *activeTeachers({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(activeTeachers, payload);
                if (response) {
                    yield put({
                        type: 'acTeacher',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *sendTeachers({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(sendTeachers, payload);
                if (response) {
                    yield put({
                        type: 'sendTeacher',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *exportKindergartenDatas({ payload, callback }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(exportKindergartenDatas, payload);
                if (response) {
                    window.open(response.downloadUrl)
                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *exportClassData({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(exportClassData, payload);
                if (response) {
                    yield put({
                        type: 'exportClassDatas',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *partnerList({ payload }, { call, put, select }) {

            const { partnerDataCache } = yield select(state => state.data)

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            });

            const response = yield call(partnerListDatas, {
                selectDate: moment().format('YYYY-MM'),
                pageIndex: 1,
                pageSize: 10,
                ...partnerDataCache,
                ...payload
            });

            if (response) {
                yield put({
                    type: 'setData',
                    payload: {
                        partnerData: response
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    partnerData: response,
                    listLoading: false,
                    partnerDataCache: {
                        ...partnerDataCache,
                        ...payload
                    }
                }
            })

        },
        *exportPartnerList({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(exportPartnerDatas, payload);
                if (response) {
                    window.open(response.downloadUrl)
                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        /**幼儿园列表 lyf 20180825 */
        *kinderList({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(kinderListDatas, payload);
                if (response) {
                    yield put({
                        type: 'kinderListData',
                        payload: response
                    })

                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        /**幼儿园列表导出 lyf 20180825 */
        *exportKinderList({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            if (payload != null) {
                const response = yield call(exportKinderDatas, payload);
                if (response) {
                    window.open(response.downloadUrl)
                }
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        *getCourseData({ payload }, { call, put }) {
            var res = yield call(queryCourseData, payload);
            if (res) {
                yield put({
                    type: 'loadCourseData',
                    payload: res
                })
            }
        },
        *getInterestList({ payload }, { call, put }) {
            var res = yield call(queryCourseDataInterestList, payload);
            if (res) {
                yield put({
                    type: 'loadInterestData',
                    payload: res
                })
            }
        },
        *exportCourseData({ payload }, { call, put }) {
            var res = yield call(exportCourseData, payload);
            if (res) {
                yield put({
                    type: 'downloadFile',
                    payload: res
                })
            }
        }
    },

    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
        listLoading(state, action) {
            return {
                ...state,
                listLoading: action.payload
            }
        },
        modalLoading(state, action) {
            return {
                ...state,
                modalLoading: action.payload
            }
        },
        showModal(state, action) {
            return {
                ...state,
                showModal: action.payload
            }
        },
        loadTeacher(state, action) {
            return {
                ...state,
                teacherData: action.payload
            }
        },
        exportList(state, action) {
            return {
                ...state,
                exportData: action.payload
            }
        },
        gartenDetail(state, action) {
            return {
                ...state,
                gartenDetails: action.payload
            }
        },
        loadClassStudent(state, action) {
            return {
                ...state,
                classStudent: action.payload
            }
        },
        activeMoms(state, action) {
            return {
                ...state,
                activeMom: action.payload
            }
        },
        finishMoms(state, action) {
            return {
                ...state,
                finishMom: action.payload
            }
        },
        acTeacher(state, action) {
            return {
                ...state,
                acTeachers: action.payload
            }
        },
        sendTeacher(state, action) {
            return {
                ...state,
                seTeachers: action.payload
            }
        },
        exportClassDatas(state, action) {
            return {
                ...state,
                exClassData: action.payload
            }
        },
        kinderListData(state, action) {
            return {
                ...state,
                kinderData: action.payload
            }
        },
        loadCourseData(state, action) {
            return {
                ...state,
                courseData: action.payload.data,
                courseDataTotal: action.payload.total
            }
        },
        loadInterestData(state, action) {
            return {
                ...state,
                interestData: action.payload.data,
                interestDataTotal: action.payload.total
            }
        },
        downloadFile(state, action) {
            return {
                ...state,
                downloadUrl: action.payload.downloadUrl
            }
        },
    }
}
