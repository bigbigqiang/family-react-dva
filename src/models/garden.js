import {
    queryGardenList,
    requestTheGardenInfo,
    queryGardenDetail,
    updateGardenDetail,
    requestUpdateGardenStatus,
    requestSendMessage,
    queryGardenVerifyDetail,
    requestVerifyGarden
} from '../services/garden'
import { requestRoles } from '../services/authority';
import { message } from 'antd';

export default {
    namespace: 'garden',

    state: {
        loading: false,
        cacheFilter: null,
        selfCacheFilter: null,
        gardens: {},
        theGarden: {},
        settingInfo: {},
        verifyInfo: null,
        messageModalVisible: false
    },

    effects: {
        *fetch({ payload }, { call, put, select }) {

            const { cacheFilter } = yield select(state => state.garden);

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                },
            });

            const res = yield call(queryGardenList, {
                channelCode: 'SD',
                searchParam: '',
                pageVo: {
                    page: 0,
                    pageSize: 10
                },
                ...cacheFilter,
                ...payload
            });

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    cacheFilter: {
                        ...cacheFilter,
                        ...payload,
                    },
                    gardens: res
                },
            });

        },
        *fetchSelf({ payload }, { call, put, select }) {

            const { selfCacheFilter } = yield select(state => state.garden);

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                },
            });

            const res = yield call(queryGardenList, {
                channelCode: 'SD',
                searchParam: '',
                pageVo: {
                    page: 0,
                    pageSize: 10
                },
                ...selfCacheFilter,
                ...payload
            });

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    selfCacheFilter: {
                        ...selfCacheFilter,
                        ...payload,
                    },
                    gardens: res
                },
            });

        },
        *getTheGarden({ payload }, { call, put }) {
            const res = yield call(requestTheGardenInfo, payload)
            yield put({
                type: 'setData',
                payload: {
                    theGarden: res
                },
            })
        },
        *setRoleForGarden({ payload }, { call, put }) {
            yield call(requestRoles, {
                searchParam: '幼儿园',
                page: 0,
                pageSize: 0
            })
        },
        *getDetail({ payload }, { call, put }) {
            const res = yield call(queryGardenDetail, payload);
            yield put({
                type: 'setData',
                payload: {
                    settingInfo: res
                }
            })
        },
        *updateDetail({ payload }, { call, put }) {
            const res = yield call(updateGardenDetail, payload);
            if (res.status === '1') {
                message.success('修改成功')
            }
        },
        *sendMessage({ payload }, { call, put }) {
            const res = yield call(requestSendMessage, payload);
            if (res.status === '1') {
                message.success('短信发送成功')
            }
        },
        *getVerifyDetail({ payload }, { call, put }) {
            const res = yield call(queryGardenVerifyDetail, payload);
            yield put({
                type: 'setData',
                payload: {
                    verifyInfo: res.data
                }
            })
        },
        *updateGardenStatus({ payload }, { call, put }) {
            console.log(payload);
            // return false;
            const res = yield call(requestUpdateGardenStatus, payload);
            if (res.status === "1") {
                message.success(payload.status === 'DELETED' ? '停用' : '启用');
                yield put({
                    type: 'setData',
                    payload: {
                        messageModalVisible: false
                    }
                })
                yield put({
                    type: 'fetch',
                    payload: {}
                })
            }
        },
        *verify({ payload }, { call, put }) {
            const res = yield call(requestVerifyGarden, payload);
            if (res.status === "1") {
                yield put({
                    type: "getVerifyDetail",
                    payload: {
                        kindergartenCode: payload.kindergartenCode
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
    }

}
