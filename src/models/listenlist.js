import { getLbListenList, deleteLbListen } from '../services/listenlist';
import { getAdList } from "../services/listenad";
import lodash from 'lodash';
export default {
    namespace: 'listenlist',

    state: {
        lbListenData: null,
        filterCache: null,
        loading: false
    },
    effects: {
        * getLbListenList({ payload }, { call, put, select }) {

            const { filterCache } = yield select(state => state.listenlist)

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(getLbListenList, {
                ...filterCache,
                ...payload
            });

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        lbListenData: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    filterCache: {
                        ...filterCache,
                        ...payload
                    }
                }
            });
        },
        *deleteLbListen({ payload }, { call, put }) {
            const res = yield call(deleteLbListen, payload);
            if (_.get(res, 'status') == '1') {
                yield put({
                    type: 'getLbListenList',
                    payload
                })
            }
        },
    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }
}
