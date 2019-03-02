

import {versionCommit} from '../services/version';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import lodash from 'lodash';

export default {
    namespace: 'version'
    , state: {
        loading:false
    }
    , effects: {
        *versionCommit({ payload }, { call, put }) {
            const response = yield call(versionCommit,payload);
            // yield put({
            //     type: 'changeLoading',
            //     payload: false,
            // });
        },
    },

    reducers: {
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
    }
}