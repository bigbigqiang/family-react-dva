import {
    serviceGetBatchList,
    serviceGetDetailList,
    servicePresentVip
} from '../services/vipsend.js'
import { Message } from 'antd';

export default {
    namespace: 'vipsend',

    state: {
        listLoading: false,
        listLoadingText: '',
        batchCount: 10,
        batchList: [],
        batchCache: null,
        detailLoading: false,
        detailCount: 10,
        detailList: [],
    },

    effects: {
        // 赠送批次列表（大列表）
        *getVipBatchList({ payload }, { call, put, select }) {

            const { batchCache } = yield select(state => state.vipsend)

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            });
            var response = yield call(serviceGetBatchList, {
                ...batchCache,
                ...payload
            });
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    batchList: response.sendHomeVipList,
                    batchCount: response.count,
                    batchCache: {
                        ...batchCache,
                        ...payload
                    }
                }
            });
        },
        // 赠送批次详情（小列表）
        *getVipDetailList({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    detailLoading: true
                }
            });
            var response = yield call(serviceGetDetailList, payload);
            yield put({
                type: 'setData',
                payload: {
                    detailLoading: false,
                    detailList: response.sendVipHistoryList,
                    detailCount: response.count,
                }
            });
        },
        *presentVip({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            });

            const response = yield call(servicePresentVip, payload);
            if (response.status === '1') {
                Message.success('赠送VIP成功')
            }
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            });
            yield put({
                type: 'getVipBatchList',
                payload: {
                    pageIndex: 1,
                    pageSize: 10 // 创建新兑换码之后，重新加载列表
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
        }
    }
}
