import {
    queryList,
    updateModuleOrder,
    updateModuleVisible,
    deleteModule,
    publish,
    preview,
    queryADList,
    queryCusList,
    addAdToHomePage,
    addCustomToHomePage,
} from '../services/appindex.js'
export default {
    namespace: 'appindex',
    state: {
        moduleList: [],
        adList: [],
        previewData: [],
        publishTime: null
    },
    effects: {
        *getList({ payload }, { call, put }) {
            var res = yield call(queryList, payload);
            yield put({
                type: 'update',
                payload: {
                    moduleList: res.list,
                    publishTime: res.publishTime
                }
            })
        },
        *setOrder({ payload }, { call, put }) {
            yield call(updateModuleOrder, payload);
            yield put({ type: 'getList', payload })
        },
        *setVisible({ payload }, { call, put }) {
            yield call(updateModuleVisible, payload);
            yield put({ type: 'getList', payload })
        },
        *deleteModule({ payload }, { call, put }) {
            yield call(deleteModule, payload);
            yield put({ type: 'getList', payload })
        },
        *publish({ payload }, { call, put }) {
            yield call(publish, payload);
            yield put({ type: 'getList', payload })
        },
        *preview({ payload }, { call, put }) {
            var res = yield call(preview, payload);
            yield put({
                type: 'update',
                payload: { previewData: res }
            })
        },
        *getADList({ payload }, { call, put }) {
            var res = yield call(queryADList, payload);
            yield put({
                type: 'update',
                payload: { adList: res }
            })
        },
        *getCusList({ payload }, { call, put }) {
            var res = yield call(queryCusList, payload);
            yield put({
                type: 'update',
                payload: { cusList: res }
            })
        },
        *addAd({ payload }, { call, put }) {
            yield call(addAdToHomePage, payload);
            yield put({ type: 'getList', payload })
        },
        *addCus({ payload }, { call, put }) {
            yield call(addCustomToHomePage, payload);
            yield put({ type: 'getList', payload })
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