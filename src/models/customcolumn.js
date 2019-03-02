/**
 * Created by Zhaoyue on 2018/9/22
 */
import { message } from 'antd';
import { customColumnList, deleteColumnList } from '../services/customcolumn';
import lodash from 'lodash';
export default {

    namespace: 'customcolumn',

    state: {
        columnLists: [],
        filterCache: null,
        loading: false
    },

    effects: {

        /*获取自定义栏目列表*/
        *getCustomColumnList({ payload }, { call, put, select }) {

            const { filterCache } = yield select(state => state.customcolumn)

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const response = yield call(customColumnList, {
                ...filterCache,
                ...payload
            });

            if (response) {
                console.log(response)
                yield put({
                    type: 'setData',
                    payload: {
                        columnLists: response
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
        /*删除自定义栏目*/
        *deleteColumnList({ payload }, { call, put }) {
            yield call(deleteColumnList, payload);
            const response = yield call(customColumnList, payload);
            if (response) {
                yield put({
                    type: 'setData',
                    payload: {
                        columnLists: response
                    }
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
        }
    }
}
