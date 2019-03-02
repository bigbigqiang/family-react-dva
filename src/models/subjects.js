import {
    generateTargetPage,
    serviceSetSubject,
    serviceGetSubject,
    serviceGetList,
    serviceGetBooks,
    serviceModifyState,
    moveSpecialTopic,
    addCustomColumn,
    updateCustomColumn

} from '../services/subjects';
import { message } from 'antd';
import lodash from 'lodash';
export default {
    namespace: 'subjects',

    state: {
        subjectData: null,
        subjectCache: null,
        listLoading: false,
        editContent: null,
        bookList: []
    },

    effects: {
        *setSubject({ payload }, { call, put }) {
            const responseTargetPage = yield call(generateTargetPage, payload.fullContent);
            payload.targetPage = responseTargetPage;
            delete payload.fullContent;
            const response = yield call(serviceSetSubject, payload);
        },
        *getSubject({ payload }, { call, put }) {
            const response = yield call(serviceGetSubject, payload);
            yield put({
                type: 'setEdit',
                payload: response
            })
            return response;
        },
        *fetchList({ payload }, { call, put, select }) {

            const { subjectCache } = yield select(state => state.subjects);

            yield put({
                type: 'listLoading',
                payload: true
            })

            const response = yield call(serviceGetList, {
                ...subjectCache,
                ...payload
            });

            yield put({
                type: 'setData',
                payload: {
                    subjectData: response,
                    listLoading: false,
                    subjectCache: {
                        ...subjectCache,
                        ...payload
                    }
                }
            })
        },
        *fetchBookList({ payload }, { call, put }) {
            const response = yield call(serviceGetBooks, payload);
            yield put({
                type: 'setBookList',
                payload: response
            })
        },
        *modifyState({ payload }, { call, put }) {
            const response = yield call(serviceModifyState, payload);
            yield put({
                type: 'fetchList',
                payload: {
                    publishFlag: payload.backType,
                }
            })
        },
        *setSubjectsOrder({ payload }, { call, put }) {
            const response = yield call(moveSpecialTopic, payload);
            yield put({
                type: 'fetchList',
                payload: {}
            })

        },
        *addCustomColumn({ payload }, { call, put }) {
            const response = yield call(addCustomColumn, payload);
            if (_.get(response, 'status') == '1') {
                message.success('新增广告横幅成功')
            }
        },
        *updateCustomColumn({ payload }, { call, put }) {
            const response = yield call(updateCustomColumn, payload);
            if (response) {

                yield put({
                    type: 'columnDetail',
                    payload: response
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
        listLoading(state, action) {
            // 修改列表加载状态
            return {
                ...state,
                listLoading: action.payload
            }
        },
        setEdit(state, action) {
            // 设置当前编辑内容
            return {
                ...state,
                editContent: action.payload
            }
        },
        clearEdit(state, action) {
            return {
                ...state,
                editContent: null
            }
        },
        setBookList(state, action) {
            // 设置供选择的图书
            return {
                ...state,
                bookList: action.payload.bookList,
                bookCount: action.payload.count
            }
        },
        columnDetail(state, action) {
            return {
                ...state,
                columnDetails: action.payload,
                customColumnBookListList: action.payload.customColumnBookListList
            }
        }
    }
}
