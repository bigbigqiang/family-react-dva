
import {
    queryList,
    updateModuleOrder,
    updateModuleVisible,
    deleteModule,
    publish,
    preview,
    queryADList,
    queryCusList,
    addAdToHomePage,
    addCustomToHomePage,
    topLbAppHome
} from '../services/listenindex.js'
export default {
    namespace: 'listenindex',
    state: {
        moduleList: [],
        adList: [],
        previewData: [],
        publishTime: null
    },
    effects: {
        *getList({ payload }, { call, put }) {
            var res = yield call(queryList, payload);
            yield put({
                type: 'update',
                payload: {
                    moduleList: res.list,
                    publishTime: res.list[0].publishDatetime,
                    total:res.total
                }
            })
        },
        *setOrder({ payload }, { call, put }) {
            yield call(updateModuleOrder, payload);
            yield put({ type: 'getList', payload })
        },
        *topOrder({ payload }, { call, put }) {
            yield call(topLbAppHome, payload);
            yield put({ type: 'getList', payload })
        },
        //设置首页模块的显示和隐藏字段
        *setVisible({ payload }, { call, put }) {
            yield call(updateModuleVisible, payload);
            yield put({ type: 'getList', payload })
        },
        //首页模块删除模块
        *deleteModule({ payload }, { call, put }) {
            yield call(deleteModule, payload);
            yield put({ type: 'getList', payload })
        },
        //发布 这就就调一个接口 再刷个页面
        *publish({ payload }, { call, put }) {
            yield call(publish, payload);
            yield put({ type: 'getList', payload })
        },
        //获取预览接口拿到的数据渲染预览界面  不知道接口改动和app首页预览差别大不大,dom改动应该是肯定的,应该就是一点列表的展示问题
        *preview({ payload }, { call, put }) {
            var res = yield call(preview, payload);
            yield put({
                type: 'update',
                payload: { previewData: res }
            })
        },
        *getADList({ payload }, { call, put }) {
            var res = yield call(queryADList, payload);
            yield put({
                type: 'update',
                payload: { adList: res }
            })
        },
        *getCusList({ payload }, { call, put }) {
            var res = yield call(queryCusList, payload);
            yield put({
                type: 'update',
                payload: { cusList: res }
            })
        },
        //首页模块 添加广告对话框的添加按钮handle 需要改为听书相关的
        *addAd({ payload }, { call, put }) {
            yield call(addAdToHomePage, payload);
            yield put({ type: 'getList', payload })
        },
        //首页模块 添加自定栏目对话框的添加按钮handle 需要改为听书相关的
        *addCus({ payload }, { call, put }) {
            yield call(addCustomToHomePage, payload);
            yield put({ type: 'getList', payload })
        },
    },
    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
