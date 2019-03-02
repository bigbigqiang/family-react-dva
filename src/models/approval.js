import {
    getKindergartenShareRatioAppliesService,
    getKindergartenShareRatioApplyDetailsService,
    auditKindergartenShareRatioApplyService,
    getPartnerShareRatioAppliesService,
    getPartnerShareRatioApplyDetailsService,
    auditPartnerShareRatioApplyService,
} from '../services/approval';

export default {
    namespace: 'approval',
    state: {
        loading: false,
        gartenCache: null,
        gartenApplies: null,
        gartenApplyDetail: null,
        partnerCache: null,
        partnerApplies: null,
        partnerApplyDetail: null,
    },
    effects: {
        *getKindergartenShareRatioApplies({ payload }, { call, put, select }) {
            if (payload.parameter === undefined) {
                payload.parameter = ""
            }

            const { gartenCache } = yield select(state => state.approval);

            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(getKindergartenShareRatioAppliesService, {
                ...gartenCache,
                ...payload
            })

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        gartenApplies: res
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
        *getKindergartenShareRatioApplyDetails({ payload }, { call, put, select }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(getKindergartenShareRatioApplyDetailsService, payload)

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        gartenApplyDetail: res
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
        *auditKindergartenShareRatioApply({ payload }, { call, put, select }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(auditKindergartenShareRatioApplyService, payload)

            if (res) {
                yield put({
                    type: 'getKindergartenShareRatioApplyDetails',
                    payload: {
                        id: payload.id,
                        kindergartenCode: payload.kindergartenCode,
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
        *getPartnerShareRatioApplies({ payload }, { call, put, select }) {
            if (payload.parameter === undefined) {
                payload.parameter = ""
            }

            const { partnerCache } = yield select(state => state.approval);

            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(getPartnerShareRatioAppliesService, {
                ...partnerCache,
                ...payload
            })

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        partnerApplies: res
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
        *getPartnerShareRatioApplyDetails({ payload }, { call, put, select }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(getPartnerShareRatioApplyDetailsService, payload)

            if (res) {
                yield put({
                    type: 'setData',
                    payload: {
                        partnerApplyDetail: res
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
        *auditPartnerShareRatioApply({ payload }, { call, put, select }) {
            yield put({
                type: 'setData',
                payload: {
                    loading: true,
                }
            });

            const res = yield call(auditPartnerShareRatioApplyService, payload)

            if (res) {
                yield put({
                    type: 'getPartnerShareRatioApplyDetails',
                    payload: {
                        id: payload.id,
                        partnerUid: payload.partnerUid,
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
