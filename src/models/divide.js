import {
    getCorpReportFormService,
    exportCorpReportFormService,
    getPartnerReportFormService,
    exportPartnerReportFormService,
    getKindergartenReportFormService,
    exportKindergartenReportFormService,
    getPartnerShareRatiosService,
    editPartnerShareRatioService,
    getKindergartenShareRatiosService,
    editKindergartenShareRatioService,
    editKindergartenShareRatioShowService
} from '../services/divide';
import { message } from 'antd';

export default {
    namespace: 'divide',
    state: {
        showEdit: false,
        loading: false,
        corpReport: null,
        corpCache: null,
        partnerReport: null,
        partnerCache: null,
        gartenReport: null,
        gartenCache: null,
        partnerDetail: null,
        gartenDetail: null,
        editNotice: null,
    },
    effects: {
        *getCorpReportForm({ payload }, { call, put, select }) {

            const { corpCache } = yield select(state => state.divide);

            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(getCorpReportFormService, {
                ...corpCache,
                ...payload
            })

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        corpReport: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    corpCache: {
                        ...corpCache,
                        ...payload
                    }
                }
            })

        },
        *exportCorpReportForm({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(exportCorpReportFormService, payload)
            if (res) {
                window.open(res)
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false
                }
            })
        },
        *getPartnerReportForm({ payload }, { call, put, select }) {

            const { partnerCache } = yield select(state => state.divide);

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(getPartnerReportFormService, {
                ...partnerCache,
                ...payload
            })

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        partnerReport: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    partnerCache: {
                        ...partnerCache,
                        ...payload
                    }
                }
            })
        },
        *exportPartnerReportForm({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(exportPartnerReportFormService, payload)
            if (res) {
                window.open(res)
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false
                }
            })
        },
        *getKindergartenReportForm({ payload }, { call, put, select }) {

            const { gartenCache } = yield select(state => state.divide);

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(getKindergartenReportFormService, {
                ...gartenCache,
                ...payload
            })

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        gartenReport: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                    gartenCache: {
                        ...gartenCache,
                        ...payload
                    }
                }
            })
        },
        *exportKindergartenReportForm({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(exportKindergartenReportFormService, payload)
            if (res) {
                window.open(res)
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false
                }
            })
        },
        *getPartnerShareRatios({ payload }, { call, put, select }) {

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(getPartnerShareRatiosService, payload)

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        partnerDetail: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                }
            })
        },
        *editPartnerShareRatio({ payload }, { call, put, select }) {

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(editPartnerShareRatioService, payload)

            if (res.status === '1') {
                yield put({
                    type: 'getPartnerShareRatios',
                    payload: {
                        partnerUid: payload.partnerUid,
                        pageNo: 1,
                        pageSize: 10
                    }
                })
                yield put({
                    type: 'setData',
                    payload: {
                        showEdit: false,
                    }
                })
                message.success('修改合伙人分成比例成功')
            } else {
                yield put({
                    type: 'setData',
                    payload: {
                        editNotice: res.message
                    }
                });
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                }
            })
        },
        *getKindergartenShareRatios({ payload }, { call, put, select }) {

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(getKindergartenShareRatiosService, payload)

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        gartenDetail: res
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                }
            })
        },
        *editKindergartenShareRatio({ payload }, { call, put, select }) {

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(editKindergartenShareRatioService, payload)

            if (res.status === '1') {
                yield put({
                    type: 'getKindergartenShareRatios',
                    payload: {
                        kindergartenCode: payload.kindergartenCode,
                        pageNo: 1,
                        pageSize: 10
                    }
                })
                yield put({
                    type: 'setData',
                    payload: {
                        showEdit: false,
                    }
                })
                message.success('修改园所分成比例成功')
            } else {
                yield put({
                    type: 'setData',
                    payload: {
                        editNotice: res.message
                    }
                });
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                }
            })
        },
        *editKindergartenShareRatioShow({ payload }, { call, put, select }) {

            yield put({
                type: 'setData',
                payload: {
                    loading: true
                }
            });

            const res = yield call(editKindergartenShareRatioShowService, payload)

            if (res) {
                if (payload.show) {
                    message.success('查看收益权限已开启')
                } else {
                    message.warn('查看收益权限已关闭')
                }
                yield put({
                    type: 'getKindergartenShareRatios',
                    payload: {
                        kindergartenCode: payload.kindergartenCode,
                        pageNo: 1,
                        pageSize: 10
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    loading: false,
                }
            })
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
