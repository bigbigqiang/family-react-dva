
import { getAdList, deleteAdList, addAds, getAdDetails,editAds} from '../services/listenad';
import { getSortParams } from '../services/listenclass'//原广告模块没把代码复制独立出来 应该是要重复写一些,减少耦合度 不过不影响大体 没做修改
export default {
    namespace: 'listenad',

    state: {
        visible: false,
        classList: [],
        sortParams: [],
        customParams: [],
        systemParams: [],
        banner_list: [],
        add_show: false,
        img_loading: false,
        now_edit_add: undefined,//用来存储整个新增广告横幅数据
    },

    effects: {
        *getAdList({ payload }, { call, put }) {
            const res = yield call(getAdList, payload);
            yield put({
                type: 'update',
                payload: {
                    getAdLists: res.list|| []
                }
            })
        },
        /*删除广告横幅*/
        *deleteAdList({ payload }, { call, put }) {
           const response=yield call(deleteAdList, payload);
            if (response) {
                yield put({
                    type: 'getAdList',
                    payload
                })
            }
        },
        /*新增广告横幅*/
        * addAds({ payload }, { call, put }) {
            let response;
            if (payload.adCode) {
                response = yield call(editAds, payload);
            }else {
                response = yield call(addAds, payload);
            }
            if (_.get(response, 'status') == '1') {
                yield put({
                    type: 'update',
                    payload: { visible: false }
                })

                yield put({
                    type: 'getAdList',
                    payload
                })
            }
        },
        /*获取广告横幅详情*/
        *handleEditAdOn({ payload }, { call, put }) {
            let res2 = yield call(getSortParams, payload);
            yield put({
                type: 'update',
                payload: {
                    sortDetails:[],
                    visible: true,
                    sortParams: res2 || [],
                    customParams: _.get(_.find(res2, ['targetType', 'LISTEN']), 'value', []),
                    systemParams: _.get(_.find(res2, ['targetType', 'SYSTEM_INTERFACE']), 'value', []),
                }
            })
        },

        /*获取广告横幅详情*/
        *getAdDetails({ payload }, { call, put }) {
            yield put({
                type: 'update',
                payload: {
                    add_show: true,
                    now_edit_add: undefined
                }
            });
            const res = yield call(getAdDetails, payload);
            let res2 = yield call(getSortParams, payload);
            yield put({
                type: 'update',
                payload: res ? {
                    sortDetails: res,
                    targetType: res.targetType,
                    targetPage: res.targetPage,
                    visible: true,
                } : []
            })
            yield put({
                type: 'update',
                payload: {
                    sortParams: res2 || [],
                    customParams: _.get(_.find(res2, ['targetType', 'LISTEN']), 'value', []),
                    systemParams: _.get(_.find(res2, ['targetType', 'SYSTEM_INTERFACE']), 'value', []),
                }
            })
        }
    },

    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }
}
