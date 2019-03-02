
import { getListenList, sortDetail, getSortParams, updateSort } from '../services/listenclass.js'
export default {
    namespace: 'listenclass',
    state: {
        visible: false,
        sortDetails: {},
        listenList: [],
        sortParams: [],
        customParams: [],
        systemParams: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            let res = yield call(getListenList, payload);
            yield put({
                type: 'update',
                payload: {
                    listenList: res
                }
            })
        },
        //获取分类详情
        *getSortDetail({ payload }, { call, put }) {
            let res = yield call(sortDetail, payload);
            let res2 = yield call(getSortParams, payload);
            yield put({
                type: 'update',
                payload: {
                    sortDetails: res,
                    targetPage: res.targetPage,
                    visible: true
                }
            })
            yield put({
                type: 'update',
                payload: {
                    sortParams: res2 || [],
                    customParams: _.get(_.find(res2, ['targetType', 'LISTEN']), 'value', []),
                    systemParams: _.get(_.find(res2, ['targetType', 'SYSTEM_INTERFACE']), 'value', []),
                }
            })
        },
        //获取下拉框的选项
        *getSortParams({ payload }, { call, put }) {
            let res = yield call(getSortParams, payload);
            yield put({
                type: 'update',
                payload: {
                    sortParams: res || [],
                    customParams: _.get(_.find(res, ['targetType', 'CUSTOM']), 'value', []),
                    systemParams: _.get(_.find(res, ['targetType', 'SYSTEM_INTERFACE']), 'value', []),
                }
            })
        },
        //排序
        *updateSort({ payload }, { call, put }) {
            yield call(updateSort, payload);
            yield put({ type: 'update', payload: { visible: false } })
            yield put({ type: 'fetch' })
        },
    },
    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
