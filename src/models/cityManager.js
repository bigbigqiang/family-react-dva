import { getCityManagerList, changeSomeCityManager, getRegionalManagerList, setOneCityManager, querryOneCityManager} from '../services/cityManager';
import { message } from 'antd';

export default {

    namespace: 'cityManager',

    state: {
        cityManagerData: {
            cityManagerList:[]
        },
        regionalManagerList:[],
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
            const response = yield call(getCityManagerList, payload);
            yield put({
                type: 'setData',
                payload: {
                    cityManagerData: response
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
            const response = yield call(setOneCityManager, payload);
            if (_.get(response, 'status') == '1') {
                message.success('添加/编辑城市经理成功！')
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
        *queryOne({ payload }, { call, put }) {
            const response = yield call(querryOneCityManager, payload);
            yield put({
                type: 'setData',
                payload: {
                    init: response,
                    showAdd: true,
                    nowUid: payload
                }
            })
        },
        *getRegionalManager({ payload }, { call, put }) {
            const response = yield call(getRegionalManagerList, payload);
            yield put({
                type: 'setData',
                payload: {
                    regionalManagerList: response
                }
            })
        },
        *changeStatus({ payload }, { call, put }) {
            // 停用或启用账户
            let {uid, status, searchParam, pageVo} = payload
            yield call(changeSomeCityManager, {uid, status})
            yield put({
                type: 'fetch',
                payload: {searchParam, pageVo}
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
    },

}
