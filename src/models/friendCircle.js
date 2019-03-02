import { getSearchCondition, getBookList, getAudioList, getSendHistoryList, toTop, cannelToTop, deleteInfo, sendInfo } from '../services/friendCircle';

import { message } from 'antd';


export default {
    namespace: 'friendCircle',

    state: {
        bookDomainList: [],
        gradeList: [],
        originalAuthorList: [],
        publishList: [],
        bookList: [],
        total: 0,
        bookListLodaing: false,
        audioList: [],
        audioTotal: 0,
        audioListLodaing: false,


        sendHistoryListData: [],
        sendHistoryTotal: 0,
        sendHistoryLoading: false,
    },

    effects: {
        // 选书选影频
        *getSearchCondition({ payload }, { call, put }) {
            const data = yield call(getSearchCondition, payload);
            console.log(data)
            yield put({
                type: 'changeCondition',
                payload: {
                    bookDomainList: data.data.bookDomainList,
                    gradeList: data.data.gradeList,
                    originalAuthorList: data.data.originalAuthorList,
                    publishList: data.data.publishList,

                }
            })
        },
        *getBookList({ payload }, { call, put }) {
            // console.log(payload);
            yield put({
                type: 'changeCondition', payload: {
                    bookListLodaing: true
                }
            })
            const data = yield call(getBookList, payload);
            // console.log(data);
            yield put({
                type: 'changeCondition', payload: {
                    bookList: data.data.dataList,
                    total: data.data.total,
                    bookListLodaing: false
                }
            })
        },
        // 选书选影频
        //选音频
        *getAudioList({ payload }, { call, put }) {
            yield put({
                type: 'changeCondition', payload: {
                    audioListLodaing: true
                }
            })
            const data = yield call(getAudioList, payload);
            yield put({
                type: 'changeCondition', payload: {
                    audioList: data.data.list,
                    audioTotal: data.data.total,
                    audioListLodaing: false
                }
            })
        },
        //选音频

        *getSendHistoryList({ payload }, { call, put }) {
            yield put({
                type: 'changeCondition', payload: {
                    sendHistoryLoading: true
                }
            });
            const res = yield call(getSendHistoryList, payload);
            if (res.data) {
                yield put({
                    type: 'changeCondition',
                    payload: {
                        sendHistoryListData: res.data.list,
                        sendHistoryTotal: res.data.total
                    }
                });
            }
            yield put({
                type: 'changeCondition', payload: {
                    sendHistoryLoading: false
                }
            });
        },
        *toTop({ payload }, { call, put }) {
            const data = yield call(toTop, payload);
            if (data.status == 1) {
                yield put({
                    type: 'getSendHistoryList',
                    payload
                })
            }
            // console.log(data);
        },
        *cannelToTop({ payload }, { call, put }) {
            const data = yield call(cannelToTop, payload);
            if (data.status == 1) {
                yield put({
                    type: 'getSendHistoryList',
                    payload
                })
            }
        },
        *deleteInfo({ payload }, { call, put }) {
            // console.log(payload);
            const data = yield call(deleteInfo, payload);
            if (data.status == 1) {
                yield put({
                    type: 'getSendHistoryList',
                    payload
                })
            }
        },
        *sendInfo({ payload, callback }, { call, put }) {
            // const { resolve } = payload;
            const data = yield call(sendInfo, payload);
            // console.log(data);
            if (data.status == 1) {
                message.success('发送成功!');
                // console.log(callback)
                callback(data.status);
                yield put({
                    type: 'getSendHistoryList',
                    payload: {
                        pageNum: payload.pageNum,
                        pageSize: payload.pageSize
                    }
                })
            }
            // console.log(payload)
        }
    },

    reducers: {
        changeCondition(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
