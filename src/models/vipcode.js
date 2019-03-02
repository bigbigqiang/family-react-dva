import {
    serviceGetBatchList,
    createExcode,
    serviceGetBatchDetailList,
    serviceGetUsedList
} from '../services/vipcode.js'

export default {
    namespace: 'vipcode',

    state: {
        listLoading: false,
        loadingText: '',
        batchList: [],
        batchCache: null,
        batchCount: 10,
        batchDetailList: [],
        batchDetailCount: 10,
        codeUsedList: [],
        codeUsedListCount: 10,
        createable: true
    },

    effects: {
        // VIP兑换码批次列表
        *getBatchList({ payload }, { call, put, select }) {

            const { batchCache } = yield select(state => state.vipcode);

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            });

            var response = yield call(serviceGetBatchList, {
                ...batchCache,
                ...payload,
            });

            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    batchList: response.batchList,
                    batchCount: response.count,
                    batchCache: {
                        ...batchCache,
                        ...payload,
                    }
                }
            });
        },
        // VIP兑换码生成
        *createCodeBatch({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true,
                    loadingText: '兑换码创建中...'
                }
            });
            const response = yield call(createExcode, payload);
            if (response) {
                window.open(response);
            } else {
                message.success('服务器超时')
            }
            yield put({
                type: 'getBatchList',
                payload: {
                    pageIndex: 1,
                    pageSize: 10 // 创建新兑换码之后，重新加载列表
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    loadingText: ''
                }
            });

        },
        // VIP兑换码批次详情
        *getBatchDetail({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true,
                }
            });
            var response = yield call(serviceGetBatchDetailList, payload);
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    batchDetailList: response.cardList,
                    batchDetailCount: response.count
                }
            });
        },
        // VIP兑换码批次使用详情
        *getUsedList({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true,
                }
            });
            var response = yield call(serviceGetUsedList, payload);
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    codeUsedList: response.cardList,
                    codeUsedListCount: response.count
                }
            });
        }
    },

    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
