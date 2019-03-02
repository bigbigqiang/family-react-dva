/**
 * Created by Zhaoyue on 2018/9/22
 */
import { message } from 'antd';
import { getAdList,deleteAdList,addAds,getAdDetails} from '../services/adbanner';
import { getSortParams } from '../services/appclass.js'
import lodash from 'lodash';
export default {

    namespace: 'adbanner',

    state: {
        visible:false,
        classList: [],
        sortParams:[],
        customParams:[],
        systemParams:[],
        banner_list: [],
        add_show: false,
        img_loading: false,
        now_edit_ads:undefined,//用来存储整个新增广告横幅数据
    },

    effects: {
        *getAdList({payload}, {call, put}) {
            yield  put({
                type: 'listLoading',
                payload: true
            });
            const response = yield call(getAdList, payload);
            if (response) {
                yield put({
                    type: 'adList',
                    payload: response
                })
            } else {
                yield put({
                    type: 'adList',
                    payload: []
                })
            }
            yield put({
                type: 'listLoading',
                payload: false
            })

        },
        /*删除广告横幅*/
        *deleteAdList({payload}, {call, put}) {
             yield call(deleteAdList, payload);
             const response = yield call(getAdList, payload);
            if (response) {
                yield put({
                    type: 'adList',
                    payload: response
                })
            }

        },
        /*新增广告横幅*/
        * addAds({ payload }, { call, put }) {
            const response = yield call(addAds, payload);
            if (_.get(response, 'status') == '1') {
                yield put({
                    type: 'toggleAdd',
                    payload: false
                })
                yield put({
                    type: 'fetch',
                    payload: payload
                })
                yield put({
                    type:'setModalVisible',
                    payload:false
                })
                const response = yield call(getAdList, payload);
                if (response) {
                    yield put({
                        type: 'adList',
                        payload: response
                    })
                } 
            }
        },
        /*获取广告横幅详情*/
        *getAdDetails({payload}, {call, put}) {
            yield  put({
                type: 'changeAds',
                payload: true
            });
            const response = yield call(getAdDetails, payload);
            let response2 = yield call(getSortParams, payload);
            if (response) {
                yield put({
                    type: 'adDetails',
                    payload: response
                })
            } else {
                yield put({
                    type: 'adDetails',
                    payload: []
                })
            }
            yield put({
                type: 'loadSortParams',
                payload: response2
            })


        }
    },

    reducers: {
        changeAds(state,action){
            if (action.payload == true) {
                return {
                    ...state,
                    add_show: action.payload,
                    now_edit_add: undefined
                }
            } else {
                // 如果是隐藏窗口，则清空目前正在编辑的内容
                return {
                    ...state,
                    add_show: action.payload,
                    now_edit_add: undefined
                }
            }
        },
        imgUploadLoading(state, action) {
            return {
                ...state,
                img_loading: action.payload
            }
        },
        adDetails(state, action) {
            return {
                ...state,
                sortDetails: action.payload,
                targetType:action.payload.targetType,
                targetPage:action.payload.targetPage,
                visible: true,
            }
        },
        adList(state,action){
            return{
                ...state,
                getAdLists:action.payload
            }

        },
        deleteAd(state, action) {
            return {
                ...state,
                deleteAds: action.payload
            }
        },
        loadSortParams(state, action) {
            return {
                ...state,
                sortParams: action.payload?action.payload:[],
                customParams:_.get(_.find(action.payload,['targetType','CUSTOM']),'value',[]),
                systemParams:_.get(_.find(action.payload,['targetType','SYSTEM_INTERFACE']),'value',[]),
            }
        },
        setTargetPage(state, action) {
            return {
                ...state,
                targetPage:action.payload
            }
        },
        setTargetType(state, action) {
            return {
                ...state,
                targetType:action.payload
            }
        },
        setModalVisible(state, action) {
            return {
                ...state,
                visible: action.payload,
            }
        },



    }
}
