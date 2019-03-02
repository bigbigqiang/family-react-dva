import { queryAccountData, querryOneAccount, setOneAccount, changeSomeAccount, requestAnyAccount, requestStopAccount, getCityManagerList } from '../services/account';
import { message } from 'antd';

export default {

    namespace: 'account',

    state: {
        accountData: [],
        cityManagerList:[],
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
            const response = yield call(queryAccountData, payload);
            yield put({
                type: 'setData',
                payload: {
                    accountData: response
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
            const response = yield call(setOneAccount, payload);
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
                    type: 'fetch'
                })
            }
        },
        *queryOne({ payload }, { call, put }) {
            const response = yield call(querryOneAccount, payload);
            yield put({
                type: 'setData',
                payload: {
                    init: response,
                    showAdd: true,
                    nowUid: payload
                }
            })
        },
        *changeStatus({ payload }, { call, put }) {
            // 停用账户
            yield call(changeSomeAccount, payload)
            yield put({
                type: 'fetch'
            })
        },
        *getCityManager({ payload }, { call, put }) {
            const response = yield call(getCityManagerList, payload);
            yield put({
                type: 'setData',
                payload: {
                    cityManagerList: response
                }
            })
        },
        *queryAnyAccount({ payload }, { call, put }) {
            let res = yield call(requestAnyAccount, payload)
            if (res.data.uid == null) {
                yield put({
                    type: 'setData',
                    payload: {
                        theAccount: null
                    }
                })
                message.error('未查找到对应用户')
            } else {
                yield put({
                    type: 'setData',
                    payload: {
                        theAccount: res.data
                    }
                })
            }
        },
        *stopAccount({ payload }, { call, put }) {
            let res = yield call(requestStopAccount, payload);
            if (res.status === '1') {
                message.success('账户注销成功')
                yield put({
                    type: 'setData',
                    payload: {
                        theAccount: null
                    }
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
        }
    },

}
