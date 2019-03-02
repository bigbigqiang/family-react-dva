import { getOperatorList,querryOneOperator,deleteOperator,setOneOperator } from '../services/operator';
import { message } from 'antd';

export default {

    namespace: 'operator',

    state: {
        operatorData: {
            operatorList:[]
        },
        formloading: false,
        showAdd: false,
        init: {},
        nowUid: null, // 当前编辑账户的uid
        button_loading: false,
        theAccount: null
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    formloading: true
                }
            });
            const response = yield call(getOperatorList, payload);
            yield put({
                type: 'setData',
                payload: {
                    operatorData: response
                }
            });
            yield put({
                type: 'setData',
                payload: {
                    formloading: false
                }
            });
        },
        *save({ payload }, { call, put }) {
            const response = yield call(setOneOperator, payload);
            if (_.get(response, 'status') == '1') {
                message.success('添加/编辑合伙人成功')
                yield put({
                    type: 'setData',
                    payload: {
                        showAdd: false,
                        nowUid: null,
                        init: {}
                    }
                })
                yield put({
                    type: 'fetch',
                    payload: {
                        searchParam: '',
                        pageVo: {
                            page: 0,
                            pageSize: 10
                        }
                    }
                })
                
            }
            
        },
        *deleteOperator({ payload }, { call, put }){
            const res = yield call(deleteOperator, payload);
            if (_.get(res, 'status') == '1') {
                message.success('删除成功！')
                yield put({
                    type: 'fetchs',
                    payload
                })
                yield put({
                    type: 'fetch',
                    payload: {
                        searchParam: '',
                        pageVo: {
                            page: 0,
                            pageSize: 10
                        }
                    }
                })
            }
        },
        *queryOne({ payload }, { call, put }) {
            const response = yield call(querryOneOperator, payload);
            yield put({
                type: 'setData',
                payload: {
                    init: response,
                    showAdd: true,
                    nowUid: payload
                }
            })
        },
    },

    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    },

}
