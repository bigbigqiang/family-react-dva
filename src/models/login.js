import { routerRedux } from 'dva/router';
import { EllaLogin } from '../services/login';
import { requestTheGardenInfo } from '../services/garden'
import { getPersonalMenu } from '../services/user'
import { cacheManager } from '../utils/utils';

export default {
    namespace: 'login',

    state: {
        status: undefined,
        menuInfo: {}
    },

    effects: {
        *getPersonalMenu({ payload }, { call, put }) {
            // 进一步取到menu菜单，才能进入运营工具
            const menuInfo = yield call(getPersonalMenu, payload);
            yield put({
                type: 'storeMenu',
                payload: JSON.stringify(menuInfo),
            });
        },
        *getGardenInfo({ payload }, { call, put }) {
            // 登录的时候，如果userType是HEADMASTER 则继续取其gardenCode
            const gardenInfo = yield call(requestTheGardenInfo, payload)
            // if (_.has(gardenInfo, 'data.kindergartenCode')) {
            yield put({
                type: 'storeCGC',
                payload: gardenInfo.data.kindergartenCode,
            });
            // }
        },
        *login({ payload }, { call, put }) {
            yield put({
                type: 'changeSubmitting',
                payload: true,
            });
            const response = yield call(EllaLogin, payload);
            console.log(payload, response)
            if (response.status === '1') {

                cacheManager.set("ellahome_token", response.data.uid);
                cacheManager.set("ellahome_customerName", response.data.mobile);
                cacheManager.set("ellahome_userType", response.data.userType);
                cacheManager.set("ellahome_login_time", new Date().getTime());

                cacheManager.set("uid", response.data.uid);
                cacheManager.set("mobile", response.data.mobile);
                cacheManager.set("userType", response.data.userType);
                cacheManager.set("loginTime", new Date().getTime());

                yield put({
                    type: 'getPersonalMenu',
                    payload: { uid: response.data.uid },
                });

                if (response.data.userType == 'HEADMASTER') {
                    yield put({
                        type: 'getGardenInfo',
                        payload: { uid: response.data.uid },
                    });
                }

                yield put({
                    type: 'changeLoginStatus',
                    payload: response,
                });

                // Login successfully
                yield put({
                    type: 'reload'
                })
            }
            else {
                yield put({
                    type: 'changeSubmitting',
                    payload: false,
                });
            }
        },
        *logout(_, { put }) {
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                },
            });
            window.ellaHomeMenu = [];

            cacheManager.clear();

            yield put(routerRedux.push('/user/login'));
        },
    },

    reducers: {
        loadMenu(state, { payload }) {
            return {
                ...state,
                menuInfo: payload
            }
        },
        changeLoginStatus(state, { payload }) {
            // console.log(payload)
            return {
                ...state,
                ...payload,
                submitting: false,
            };
        },
        changeSubmitting(state, { payload }) {
            return {
                ...state,
                submitting: payload,
            };
        },
        reload(state, { payload }) {
            setTimeout(function () {
                window.location.href = window.location.href.replace('/#/user/login', '/');
            }, 1000)
            return state;
        },
        storeCGC(state, { payload }) {
            console.log(payload)
            cacheManager.set('ellahome_CGC', payload);
            return state;
        },
        storeMenu(state, { payload }) {
            cacheManager.set('ellahome_menu', payload)
            return state;
        },
    },
};
