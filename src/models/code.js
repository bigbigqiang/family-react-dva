import { getTheCode } from '../services/code';
import { message } from 'antd';

export default {
    namespace: 'code',
    state: {
        loading: false,
        theCode: null,
    },
    effects: {
        *queryAnyCode({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            })
            const res = yield call(getTheCode, payload)
            yield put({
                type: 'setData',
                payload: {
                    theCode: res,
                    loading: false
                }
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
    }
}
