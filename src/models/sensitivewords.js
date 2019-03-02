import { searchWord, deleteWord, addWord } from '../services/sensitivewords';

import { message } from 'antd';


export default {
    namespace: 'sensitivewords',

    state: {
        sensitiveWordsList: [],
        searchSensitiveWord: '',//搜索的值
        loading: false,
    },

    effects: {
        *searchWord({ payload }, { call, put }) {
            yield put({ type: 'changeLoading', payload: { loading: true } });
            const data = yield call(searchWord, payload);
            if (data.status == 1) {
                //    console.log(payload)
                yield put({
                    type: 'setSensitiveWordsList', payload: {
                        sensitiveWordsList: data.data,
                        searchSensitiveWord: payload.sensitiveName
                    }
                })
            }
            yield put({ type: 'changeLoading', payload: { loading: false } });
        },
        *deleteWord({ payload }, { call, put, select }) {
            const data = yield call(deleteWord, payload);
            // console.log(data);
            const { searchSensitiveWord } = yield select(state => state.sensitivewords);
            // console.log(searchSensitiveWord)
            if (data.status == 1) {
                yield put({
                    type: 'searchWord', payload: {
                        sensitiveName: searchSensitiveWord
                    }
                });
            }
        },
        *addWord({ payload }, { call, put, select }) {
            const data = yield call(addWord, payload);
            const { searchSensitiveWord } = yield select(state => state.sensitivewords);
            if (data.status == 1) {
                yield put({
                    type: 'searchWord', payload: {
                        sensitiveName: searchSensitiveWord
                    }
                });
            }
            // console.log(data);
        }
    },

    reducers: {
        setSensitiveWordsList(state, { payload }) {
            // console.log(payload)
            return {
                ...state,
                ...payload,
            }
        },
        changeLoading(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}
