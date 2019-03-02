/**
 * Created by Zhaoyue on 2018/11/6
 */
import { queryByLbListenCode, lbListenDetail, queryBookAudioParams, queryBookAudioList, updateLbListen, addLbListen } from '../services/listenedit';
import { message } from 'antd';
import lodash from 'lodash';

export default {
    namespace: 'listenedit',

    state: {
        publishList: [],
        lbListenList: [],
        lbListenDetail: []
    },

    effects: {
        * queryByLbListenCode({ payload }, { call, put }) {
            const res = yield call(queryByLbListenCode, payload);
            const res2 = yield call(lbListenDetail, payload);
            yield put({
                type: 'update',
                payload: {
                    lbListenList: res || []
                }
            })
            yield put({
                type: 'update',
                payload: {
                    lbListenDetail: res2,

                }
            })

        },
        *getListenList({ payload }, { call, put }) {
            yield put({
                type: 'update',
                payload: {
                    cusVisible: true
                }
            });
            const res = yield call(queryBookAudioParams, payload);
            const res2 = yield call(queryBookAudioList, payload);
            yield put({
                type: 'update',
                payload: {
                    publishList: res.publishList,
                    originalAuthorList: res.originalAuthorList,
                    bookPictureClassList: res.bookPictureClassList
                }
            })
            yield put({
                type: 'update',
                payload: {
                    audioList: res2 || [],
                    listLoading: false
                }
            })

        },
        *editLbList({ payload }, { call, put }) {
            let res;
            if (payload.listenCode) {
                res = yield call(updateLbListen, payload);
                if (_.get(res, 'status') == '1') {
                    message.success('编辑听单成功')
                }
            } else {
                res = yield call(addLbListen, payload);
                if (_.get(res, 'status') == '1') {
                    message.success('新增听单成功')
                }
            }

        }



    },

    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
        listBoth(state, { payload }) {
            let list = payload ? payload.newDataSource : [];
            let templist = _.concat(state.lbListenList, list);
            //去重,遇到重复的书籍自动去重
            let hash = {};
            templist = templist.reduce(function (item, next) {
                hash[next.audioCode] ? '' : hash[next.audioCode] = true && item.push(next);
                return item
            }, []);
            return {
                ...state,
                lbListenList: templist,
                cusVisible: false

            }
        },
        arrowDeletes(state, { payload }) {
            let key = payload.key;
            let data = state.lbListenList.filter(item => {
                if (item.audioCode !== key.audioCode) {
                    return item
                }
            });
            return {
                ...state,
                lbListenList: data,
            }
        },
        arrowUp(state, { payload }) {
            let n = payload.n;
            let data = state.lbListenList;
            let arr1 = data[n - 1];
            data[n - 1] = data[n];
            data[n] = arr1;
            return {
                ...state,
                lbListenList: data,
            }
        },
        arrowDown(state, { payload }) {
            let n = payload.n;
            let data = state.lbListenList;
            let arr1 = data[n];
            data[n] = data[n + 1];
            data[n + 1] = arr1;
            return {
                ...state,
                lbListenList: data,
            }
        },
        arrowTop(state, { payload }) {
            let n = payload.n;
            let data = state.lbListenList;
            let arr1 = data[n];
            data.unshift(arr1);
            data.splice(n+1,1);
            return {
                ...state,
                lbListenList: data,
            }
        },
        DeleteList(state, { payload }) {
            let data = [];
            return {
                ...state,
                lbListenList: data,
            }
        },
        WillMount(state, { payload }) {
            let data = [];
            return {
                ...state,
                lbListenDetail: data,
                lbListenList: data,
            }
        },
    }
}
