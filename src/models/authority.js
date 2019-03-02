import { message } from 'antd';
import {
    requestAccounts,
    requestRoles,
    requestTheRole,
    setTheRole, // 成员列表，分配角色
    requestAuthorityTree,
    requestTheAuthority,
    setRole, // 角色列表，新增和编辑角色
    setAuthority, // 角色列表，设置角色的权限
    deleteRole, // 角色列表，删除角色
} from '../services/authority';

import lodash from 'lodash';

export default {
    namespace: 'authority',

    state: {
        accountsData: {},
        rolesData: {},
        theRole: [],
        listLoading: false,
        modalLoading: false,
        showRoleSelector: false,
        authorityTree: [],
        authorityData: {},
        showAuthoritySelector: false,
    },

    effects: {
        *fetchAccounts({ payload }, { call, put }) {
            // 获取成员列表
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(requestAccounts, payload);
            yield put({
                type: 'setData',
                payload: {
                    accountsData: response,
                    listLoading: false
                }
            })
        },
        *fetchRoles({ payload }, { call, put }) {
            // 获取角色列表
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(requestRoles, payload);
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    rolesData: response || []
                }
            })
        },
        *fetchOnlyRoleData({ payload }, { call, put }) {
            // 获取指定用户的角色（数组）
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(requestTheRole, payload);
            yield put({
                type: 'setData',
                payload: {
                    theRole: response,
                    listLoading: false
                }
            })
        },
        *fetchTheRole({ payload }, { call, put }) {
            // 获取指定用户的角色（数组）
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const response = yield call(requestTheRole, payload);
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false,
                    showRoleSelector: true,
                    theRole: response,
                }
            })
        },
        *setTheRole({ payload }, { call, put }) {
            // 设置指定用户的角色（数组）
            yield put({
                type: 'setData',
                payload: {
                    modalLoading: true
                }
            })
            const response = yield call(setTheRole, payload);
            if (response.status === '1') {
                if (payload.roleCodeList.length === 0) {
                    message.success('删除权限成功')
                } else {
                    message.success('分配角色成功')
                }
            }
            yield put({
                type: 'setData',
                payload: {
                    showRoleSelector: false,
                    modalLoading: false
                }
            })
            yield put({
                type: 'fetchAccounts',
                payload: {
                    page: 0,
                    pageSize: 10
                }
            })
        },
        *fetchTheAuthority({ payload }, { call, put }) {
            // 编辑角色时，获取权限数据
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })

            // 获取并返回权限树
            const response = yield call(requestAuthorityTree);
            // console.log('model-空权限树：', response)
            yield put({
                type: 'setData',
                payload: {
                    authorityTree: response
                }
            })

            // 如果请求带了roleCode，则请求并返回其权限数据
            if (payload.roleCode) {
                const response = yield call(requestTheAuthority, payload);
                // console.log('model-已有权限：', response)
                yield put({
                    type: 'setData',
                    payload: {
                        authorityData: response
                    }
                })
            } else {
                yield put({
                    type: 'setData',
                    payload: {
                        authorityData: []
                    }
                })
            }
            yield put({
                type: 'setData',
                payload: {
                    showAuthoritySelector: true,
                    listLoading: false
                }
            })
        },
        *setTheAuthority({ payload }, { call, put }) {
            // roleCode存在则为编辑，不存在则为新增
            yield put({
                type: 'setData',
                payload: {
                    modalLoading: true
                }
            })
            const roleRes = yield call(setRole, { roleCode: payload.roleCode, roleName: payload.roleName })
            const authorityRes = yield call(setAuthority, { roleCode: roleRes.data, menuCodeList: payload.menuCodeList || [] })
            if (authorityRes === true) {
                message.success(payload.roleCode ? '编辑角色成功' : '添加角色成功')
            } else if (roleRes.status === '1') {
                message.warn(payload.roleCode ? '角色编辑未完成，请尝试重试' : '角色添加未完成，请到角色列表进行进一步权限分配')
            } else {
                message.error(payload.roleCode ? '角色编辑失败，请联系工作人员' : '角色添加失败，请联系工作人员')
            }
            yield put({
                type: 'fetchRoles',
                payload: {
                    page: 0,
                    pageSize: 10
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    modalLoading: false,
                    showAuthoritySelector: false
                }
            })
        },
        *deleteTheRole({ payload }, { call, put }) {
            const response = yield call(deleteRole, payload);
            if (response === true) {
                yield put({
                    type: 'fetchRoles',
                    payload: {
                        page: 0,
                        pageSize: 10
                    }
                })
                message.success('删除角色成功');
            } else {
                message.error('删除角色失败');
            }
        }
    },

    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
};
