import { queryClassList, sortDetail, getSortParams, updateSort } from '../services/appclass.js'
export default {
    namespace: 'appclass',
    state: {
        visible: false,
        sortDetails: {},
        classList: [],
        sortParams: [],
        customParams: [],
        systemParams: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            let res = yield call(queryClassList, payload);
            yield put({
                type: 'update',
                payload: {
                    classList: res
                }
            })
        },
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
                    customParams: _.get(_.find(res2, ['targetType', 'CUSTOM']), 'value', []),
                    systemParams: _.get(_.find(res2, ['targetType', 'SYSTEM_INTERFACE']), 'value', []),
                }
            })
        },
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
