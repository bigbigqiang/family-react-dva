import { getDailyInfoList, getDailyChartInfoList, getDetailList, deleteInfo } from '../services/sensitiveinfo';

import { message } from 'antd';


export default {
    namespace: 'sensitiveinfo',

    state: {
        kindergartenListData: [],//幼儿园每日列表
        kindergartenTotal: 0,   //幼儿园每日列表总数
        contentChartData: [],   //发送内容数量图表数据
        personChartData: [],    //人物发送数量图表数据
        sendTotal: 0,           //信息总数
        kindergartenListLoading: false,

        detailInfoList: [],     //每个幼儿园信息列表
        detailInfoTotal: 0,
        detailInfoListLoading: false,
    },

    effects: {
        *getDailyInfoList({ payload }, { call, put }) {
            yield put({
                type: 'changeCondition',
                payload: { kindergartenListLoading: true }
            });
            const data = yield call(getDailyInfoList, payload);
            // console.log(data);
            yield put({
                type: 'changeCondition', payload: {
                    kindergartenListData: data.data.list,
                    kindergartenTotal: data.data.total
                }
            });
            yield put({
                type: 'changeCondition',
                payload: { kindergartenListLoading: false }
            })
        },
        *getDailyChartInfoList({ payload }, { call, put }) {
            const data = yield call(getDailyChartInfoList, payload);
            // console.log(data);
            const contentChartData = [
                {
                    item: '纯文字',
                    count: _.get(data.data[0], 'textNum')
                }, {
                    item: '图片',
                    count: _.get(data.data[0], 'imgNum')
                }, {
                    item: '音频',
                    count: _.get(data.data[0], 'audioNum')
                }, {
                    item: '听单',
                    count: _.get(data.data[0], 'listenNum')
                }, {
                    item: '视频',
                    count: _.get(data.data[0], 'videoNum')
                }
            ];
            const personChartData = [
                {
                    item: '园长',
                    count: _.get(data.data[0], 'headmasterSend')
                }, {
                    item: '老师',
                    count: _.get(data.data[0], 'teacherSend')
                }, {
                    item: '家长',
                    count: _.get(data.data[0], 'parentSend')
                }
            ];
            yield put({
                type: 'changeCondition', payload: {
                    contentChartData,
                    personChartData,
                    sendTotal: _.get(data.data[0], 'sendTotal')
                }
            })
        },
        *getDetailList({ payload }, { call, put }) {
            yield put({
                type: 'changeCondition',
                payload: { detailInfoListLoading: true }
            });
            // console.log(payload);
            const data = yield call(getDetailList, payload);
            // console.log(payload.kindergartenCode)
            // console.log(data);
            yield put({
                type: 'changeCondition',
                payload: {
                    detailInfoList: data.data.list,
                    detailInfoTotal: data.data.total
                }
            });
            yield put({
                type: 'changeCondition',
                payload: { detailInfoListLoading: false }
            });
        },
        *deleteInfo({ payload }, { call, put }) {
            const data = yield call(deleteInfo, payload);
            if (data.status == 1) {
                yield put({
                    type: 'getDetailList',
                    payload
                })
            }
        }
    },

    reducers: {
        changeCondition(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
