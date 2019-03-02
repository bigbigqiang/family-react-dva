/**
 * Created by Zhaoyue on 2018/9/22
 */
import {
    addCustomColumn,
    updateCustomColumn,
    bookResultItem,
    columnQueryBookList,
    editCustomColumn
} from '../services/customedit';
import { message } from 'antd';
import lodash from 'lodash';
export default {
    namespace: 'customedit',

    state: {
        subjectList: [],
        subjectCount: 0,
        listLoading: false,
        editContent: null,
        showAddBook: false,
        bookList: [],
        publishList: [],
        authorList: [],
        bookDomainClassList: [],
        columnDetails: [],
        customColumnBookListList: [],
        bookData: [],
        total: 0
    },

    effects: {
        *addCustomColumn({ payload }, { call, put }) {
            const response = yield call(addCustomColumn, payload);
            if (_.get(response, 'status') == '1') {
                message.success('新增自定义栏目成功')
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
        *editCustomColumn({ payload }, { call, put }) {
            const response = yield call(editCustomColumn, payload);
            if (_.get(response, 'status') == '1') {
                message.success('编辑自定义栏目成功')
            }
        },
        *bookResultItem({ payload }, { call, put }) {
            const response = yield call(bookResultItem, payload);
            if (response) {
                yield put({
                    type: 'resultItem',
                    payload: response
                })
            }
        },
        *columnQueryBookList({ payload }, { call, put }) {
            yield put({
                type: 'listLoading',
                payload: true
            });
            const response = yield call(columnQueryBookList, payload);
            console.log(response)
            if (response) {
                yield put({
                    type: 'columnBookList',
                    payload: response
                })
                yield put({
                    type: 'listLoading',
                    payload: false
                });
            }

        },
        *listboth({ payload }, { call, put }) {
            yield put({
                type: 'bothlist',
                payload: payload
            })
        },
        *arrowDelete({ payload }, { call, put }) {
            yield put({
                type: 'arrowDeletes',
                payload: payload.key
            })
        },
        *arrowUp({ payload }, { call, put }) {
            yield put({
                type: 'arrowUps',
                payload: payload
            })
        },
        *arrowDown({ payload }, { call, put }) {
            yield put({
                type: 'arrowDowns',
                payload: payload
            })
        },
        *DeleteList({ payload }, { call, put }) {
            yield put({
                type: 'DeleteLists',
                payload: payload
            })
        },
        *WillMount({ payload }, { call, put }) {
            yield put({
                type: 'WillMounts',
                payload: payload
            })
        }

    },

    reducers: {
        updateList(state, action) {
            // 更新列表
            return {
                ...state,
                subjectList: action.payload.topicList,
                subjectCount: action.payload.count
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
        },
        resultItem(state, action) {
            return {
                ...state,
                publishList: action.payload.publishList,
                authorList: action.payload.originalAuthorList,
                bookDomainClassList: action.payload.bookDomainList,
            }
        },
        columnBookList(state, action) {
            console.log(action.payload);
            return {
                ...state,
                bookData: action.payload,
                total: action.payload.total
            }
        },
        bothlist(state, action) {
            let list = action.payload ? action.payload.newDataSource : [];
            let templist = _.concat(state.customColumnBookListList, list);
            //去重,遇到重复的书籍自动去重
            let hash = {};
            templist = templist.reduce(function (item, next) {
                hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
                return item
            }, []);
            return {
                ...state,
                customColumnBookListList: templist,

            }
        },
        arrowDeletes(state, action) {
            let key = action.payload.key;
            let data = state.customColumnBookListList.filter(item => {
                if (item.bookCode !== key.bookCode) {
                    return item;
                }
            });
            return {
                ...state,
                customColumnBookListList: data,
            }
        },
        arrowTop(state, action) {
            let n = action.payload.n;
            let data = state.customColumnBookListList;
            let arr1 = data.splice(n, 1);
            data.unshift(arr1[0])
            return {
                ...state,
                customColumnBookListList: data,
            }
        },
        arrowUps(state, action) {
            let n = action.payload.n;
            let data = state.customColumnBookListList;
            let arr1 = data[n - 1];
            data[n - 1] = data[n];
            data[n] = arr1;
            return {
                ...state,
                customColumnBookListList: data,
            }
        },
        arrowDowns(state, action) {
            let n = action.payload.n;
            let data = state.customColumnBookListList;
            let arr1 = data[n];
            data[n] = data[n + 1];
            data[n + 1] = arr1;
            return {
                ...state,
                customColumnBookListList: data,
            }
        },
        DeleteLists(state, action) {
            let data = [];
            return {
                ...state,
                customColumnBookListList: data,
            }
        },
        WillMounts(state, action) {
            let data = [];
            return {
                ...state,
                columnDetails: data,
                customColumnBookListList: data,
            }
        },
        showPlanModal(state, action) {
            //显示弹窗
            return {
                ...state,
                cusVisible: true
            }
        },
        hidePlanModal(state, action) {
            // 隐藏弹窗
            return {
                ...state,
                cusVisible: false,
                bookData: []
            }
        },
    }
}
