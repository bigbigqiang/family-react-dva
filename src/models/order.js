

import {
    queryOrderList,
    queryParams,
    requestOutPut
} from '../services/order';

export default {
    namespace: 'order',
    state: {
        orderList: [],
        count: 0,
        paymentPlantform: [],
        orderStatus: [],
        goods: []
    },
    effects: {
        *getOrderList({ payload }, { call, put }) {
            const response = yield call(queryOrderList, payload);
            yield put({
                type: 'showOrderList',
                payload: response
            })
        },
        *outPutOrderList({ payload }, { call, put }) {
            const res = yield call(requestOutPut, payload);
            window.open(res.data)
        },
        *getParams({ payload }, { call, put }) {
            const response = yield call(queryParams, payload);
            yield put({
                type: 'showParams',
                payload: response
            })
        },
    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
        showOrderList(state, action) {
            let list = action.payload.result || [];
            return {
                ...state,
                orderList: list.map(item => {
                    item.key = item.orderNo;
                    return item;
                }),
                count: action.payload.count
            }
        },
        showParams(state, action) {
            return {
                ...state,
                paymentPlantform: action.payload.paymentPlantform || [],
                orderStatus: action.payload.orderStatus || [],
                goods: action.payload.goods || []
            }
        }
    }
}
