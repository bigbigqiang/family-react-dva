import { queryClassList } from '../services/test.js'
export default {
    namespace: 'test',
    state: {
        classList: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            let response = yield call(queryClassList, payload);
            yield put({
                type: 'update',
                payload: { classList: response }
            })
        },
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