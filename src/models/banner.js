import { message } from 'antd';
import { queryBannerList, queryOneBanner, setBanner, setBannerStatus, setBannerSort } from '../services/banner';
export default {

    namespace: 'banner',

    state: {
        banner_list: [],
        add_show: false,
        img_loading: false,
        // book_btn_name: '点击选择指定的书目',
        // aim_set: undefined, // 用来存储，从书籍列表选中的图书信息，banner图目标
        nowEditBanner: undefined, // 用来存储整个banner图数据
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            // console.log('queryBannerList---------------', payload);
            const response = yield call(queryBannerList, payload);
            yield put({
                type: 'loadBannerList',
                payload: response,
            })
        },
        *fetchOneBanner({ payload }, { call, put }) {
            // 如果是编辑图片，必然会进行一次查询，这个时候设置bannerCode
            const response = yield call(queryOneBanner, payload);
            if (response) {
                console.log('1111111111111111111111111111111111111111111111111111111111111111111')
                yield put({
                    type: 'toggleAdd',
                    payload: true
                })
                yield put({
                    type: 'setInitEdit', // 设置默认编辑的banner信息
                    payload: response
                })
            }
            // yield put({
            //     type: 'setBook',
            //     payload: {
            //         bookName: response.bookName,
            //         targetPage: response.targetPage,
            //     }
            // })
        },
        *addBanner({ payload }, { call, put }) {
            /**
             *  需要判断 payload 中的 payload.values.aim
             *  如果有值，则为设置链接
             *  如果没有值，则为book，则需要去payload.meta.aim_set
             *
             *  如果添加成功，则清除bannerCode
             *  如果编辑，则清除BannerCode
             *  如果编辑失败，则不清除bannerCode
             */
            if (!_.get(payload, 'meta.PreViewImageUrl') && !_.get(payload, 'meta.nowEditBanner.bannerImageUrl')) {
                message.error('请先选择图片');
                return false;
            }
            let params = {};
            let meta = _.get(payload, 'meta');
            let values = _.get(payload, 'values');
            let nowEditBanner = _.get(payload, 'meta.nowEditBanner');
            let PreViewImageUrl = _.get(payload, 'meta.PreViewImageUrl');
            if (nowEditBanner) {
                params = {
                    ...values,
                    bannerCode: nowEditBanner.bannerCode,
                    targetType: 'H5',
                    bannerImageUrl: PreViewImageUrl != "" ? PreViewImageUrl : nowEditBanner.bannerImageUrl,
                    status: meta.type
                }
            } else {
                params = {
                    ...values,
                    targetType: 'H5',
                    bannerImageUrl: PreViewImageUrl,
                    status: meta.type
                }
            }
            // console.log(params)
            const response = yield call(setBanner, params);
            if (_.get(response, 'status') == '1') {
                message.success('Banner图设置成功')
                // console.log(payload)
                yield put({
                    type: 'toggleAdd',
                    payload: false
                })
                yield put({
                    type: 'setInitEdit', // 设置默认编辑的banner信息
                    payload: undefined
                })
                yield put({
                    type: 'fetch',
                    payload: {
                        status: payload.searchStatus
                    }
                })
            }
        },
        *changeBannerStatus({ payload }, { call, put }) {
            const response = yield call(setBannerStatus, payload)
            yield put({
                type: 'fetch',
                payload: payload.values
            })
        },
        *changeBannerSort({ payload }, { call, put }) {
            const response = yield call(setBannerSort, {
                bannerCode: payload.bannerCode,
                sequence: payload.sequence,
                status: payload.status
            })
            yield put({
                type: 'fetch',
                payload: {
                    status: payload.status
                }
            })
        },
    },

    reducers: {
        loadBannerList(state, action) {
            return {
                ...state,
                banner_list: action.payload
            }
        },
        toggleAdd(state, action) {
            if (action.payload == true) {
                return {
                    ...state,
                    add_show: action.payload,
                    // aim_set: undefined,
                }
            } else {
                // 如果是隐藏窗口，则清空目前正在编辑的内容
                return {
                    ...state,
                    add_show: action.payload,
                    // aim_set: undefined,
                    nowEditBanner: undefined,
                }
            }
        },
        setInitEdit(state, action) {
            return {
                ...state,
                nowEditBanner: action.payload
            }
        }
    }
}
