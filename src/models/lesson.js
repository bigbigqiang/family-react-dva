import {
    queryLessonData,
    queryBookSearchCongfig,
    queryBookList,
    sqladdToScheduleDef,
    sqldelFromScheduleDef,
    sqlsetPlan,
    queryPlan,
    queryWorkList,
    sqlsetBookWork,
    queryClassListByGrade,
    sqladdToSchedule,
    sqldelFromSchedule,
    recoverToDef,
    queryKindergartenList,
    recoverPlan
} from '../services/lesson';

export default {
    namespace: 'lesson'
    , state: {
        kindergartenList: [],//幼儿园列表
        publishlist: [],//出版社列表
        bookDomainClassList: [],//书籍领域列表
        bookTopicClassList: [],//书籍主题分类列表
        gradeList: [],//年级列表
        classListByGrade: [],//年级下的班级列表
        bookList: [],//书籍列表
        bookListCount: 0,//书籍总数
        bookSelectedCount: 0,//当前课表选中的书籍数量
        lesson_data_def: [],//默认课表信息
        lesson_data: [],//自定义课表信息
        workList: [],//作业列表
        bookInfo: {},//书籍详情
        initData: {
            target: "暂无教案",
            preparation: "暂无教案",
            process: "暂无教案",
            activityExtension: "暂无教案"
        }
    }
    , effects: {
        *lessonInit({ payload }, { call, put }) {
            //获取主题分类列表
            const R1 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookTopicClassList'
            });
            //获取领域列表
            const R2 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookDomainClassList'
            });
            //获取出版社列表
            const R3 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.publishList'
            });
            //获取幼儿园列表
            const R4 = yield call(queryKindergartenList, {
                pageVo: {
                    pageSize: 999999
                }
            });
            //获取年级列表
            const R5 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookGradeList'
            });
            yield put({
                type: 'loadLesson',
                payload: {
                    R1: R1,
                    R2: R2,
                    R3: R3,
                    R4: R4,
                    R5: R5
                }
            })
        },
        *lessonInitDefault({ payload }, { call, put }) {
            //获取主题分类列表
            const R1 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookTopicClassList'
            });
            //获取领域列表
            const R2 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookDomainClassList'
            });
            //获取出版社列表
            const R3 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.publishList'
            });
            //获取幼儿园列表
            // const R4 = yield call(queryKindergartenList, {
            //     pageVo: {
            //         pageSize: 999999
            //     }
            // });
            //获取年级列表
            const R5 = yield call(queryBookSearchCongfig, {
                groupId: 'operation.box.bookGradeList'
            });
            yield put({
                type: 'loadLesson',
                payload: {
                    R1: R1,
                    R2: R2,
                    R3: R3,
                    // R4: R4,
                    R5: R5
                }
            })
        },
        *recoverToDef({ payload }, { call, put }) {
            const response = yield call(recoverToDef, payload);
        },
        *getClassListByGrade({ payload }, { call, put }) {
            if (payload.kindergartenCode) {
                payload.gradeCode = 'G0000000003'
                const G3 = yield call(queryClassListByGrade, payload);
                payload.gradeCode = 'G0000000002'
                const G2 = yield call(queryClassListByGrade, payload);
                payload.gradeCode = 'G0000000001'
                const G1 = yield call(queryClassListByGrade, payload);
                let cascaderOptions = [
                    {
                        value: 'G0000000003',
                        label: '大班',
                        children: [],
                    }, {
                        value: 'G0000000002',
                        label: '中班',
                        children: [],
                    }, {
                        value: 'G0000000001',
                        label: '小班',
                        children: [],
                    }
                ]
                G3.map((item) => {
                    cascaderOptions[0].children.push({ value: item.classCode, label: item.className })
                })
                G2.map((item) => {
                    cascaderOptions[1].children.push({ value: item.classCode, label: item.className })
                })
                G1.map((item) => {
                    cascaderOptions[2].children.push({ value: item.classCode, label: item.className })
                })
                yield put({
                    type: 'showClassListByGrade',
                    payload: cascaderOptions
                })
            }
            else {
                yield put({
                    type: 'showClassListByGrade',
                    payload: []
                })
            }
        },
        *setBookWork({ payload }, { call, put }) {
            const response = yield call(sqlsetBookWork, payload);
            yield put({
                type: 'hideWorkModal'
            })
        },
        *getWorkList({ payload }, { call, put }) {
            const response = yield call(queryWorkList, payload);
            yield put({
                type: 'showWorkModal',
                payload: response
            })
        },
        *setPlan({ payload }, { call, put }) {
            const response = yield call(sqlsetPlan, payload);
            yield put({
                type: 'hidePlanModal'
            })
        },
        *getPlan({ payload }, { call, put }) {
            const response = yield call(queryPlan, payload);
            yield put({
                type: 'showPlanModal',
                payload: response ? response : {
                    target: "暂无教案",
                    preparation: "暂无教案",
                    process: "暂无教案",
                    activityExtension: "暂无教案"
                }
            })
        },
        *recoverPlan({ payload }, { call, put }) {
            const response = yield call(recoverPlan, payload);

            const res = yield call(queryPlan, payload);
            yield put({
                type: 'showPlanModal',
                payload: res
            })
        },
        *addBookToDefaultLesson({ payload }, { call, put }) {
            //添加图书到默认课程表
            const response = yield call(sqladdToScheduleDef, payload);
        },
        *delBookFromDefaultLesson({ payload }, { call, put }) {
            const response = yield call(sqldelFromScheduleDef, payload);
            yield put({
                type: 'getLesson',
                payload: payload
            })
        },
        *addBookToLesson({ payload }, { call, put }) {
            const response = yield call(sqladdToSchedule, payload);
        },
        *delBookFromLesson({ payload }, { call, put }) {
            const response = yield call(sqldelFromSchedule, payload);
            yield put({
                type: 'getLesson',
                payload: payload
            })
        },
        *getBookList({ payload }, { call, put }) {
            //获取图书列表
            const response = yield call(queryBookList, payload);
            yield put({
                type: 'loadBookList',
                payload: response
            })
        },
        *getLesson({ payload }, { call, put }) {
            // TODO: 页面第一次打开，先查询，应该先request数据，然后payload
            // TODO: 页面点击查询之后，根据 大中小班，日期获取课程信息，
            const response = yield call(queryLessonData, payload);
            console.log(response)
            yield put({
                type: 'loadLessonData',
                payload: {
                    sType: payload.scheduleType,
                    response: response ? response : []
                }
            })
        }
    },
    reducers: {
        loadLesson(state, action) {
            return {
                ...state,
                kindergartenList: action.payload.R4 || [],
                publishlist: action.payload.R3 || [],
                bookDomainClassList: action.payload.R2 || [],
                bookTopicClassList: action.payload.R1 || [],
                gradeList: action.payload.R5 || []
            }
        },
        showClassListByGrade(state, action) {
            return {
                ...state,
                classListByGrade: action.payload
            }
        },
        loadBookList(state, action) {
            return {
                ...state,
                bookList: action.payload.bookQueryDtoList,
                bookListCount: action.payload.total,
                bookSelectedCount: action.payload.num,
                booklistloading: false
            }
        },
        loadLessonData(state, action) {
            switch (action.payload.sType) {
                case 'default':
                    return {
                        ...state,
                        lesson_data_def: action.payload.response
                    }
                case 'custom':
                    return {
                        ...state,
                        lesson_data: action.payload.response
                    }
                default:
                    return { ...state };
            }
        },
        showWorkModal(state, action) {
            //获取作业选择信息并显示弹窗
            return {
                ...state
                , workList: action.payload
                , workVisible: true
            }
        },
        showBookDetailModal(state, action) {
            //获取图书详情并显示弹窗
            return {
                ...state
                , bookInfo: action.payload.bookInfo
                , bookInfoVisible: true
            }
        },
        showPlanModal(state, action) {
            //获取教案信息并显示弹窗
            return {
                ...state
                , initData: action.payload
                , cusVisible: true
            }
        },
        hidePlanModal(state, action) {
            // 隐藏教案弹窗
            return {
                ...state
                , cusVisible: false
            }
        },
        hideBookDetailModal(state, action) {
            // 隐藏教案弹窗
            return {
                ...state
                , bookInfoVisible: false
            }
        },
        hideWorkModal(state, action) {
            // 隐藏教案弹窗
            return {
                ...state
                , workVisible: false
            }
        }
    }
}
