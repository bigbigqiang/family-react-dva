import {
    getTheClass,
    getClassList,
    requestRiseGrade,
    requestTheHistory,
    requestTeacherInClass,
    requestTeacherNotInClass,
    addTeacherToClass,
    removeTeacherFromClass,
    deleteClassByclassCode,
    addStudentToClass,
    deleteStudentFromClass
} from '../services/class';

import {
    getStudentsByClass
} from '../services/student';

import { message } from 'antd';

let lastFetchProps = null;

export default {
    namespace: 'class',

    state: {
        listLoading: false,
        classList: [],
        upperClassList: [],
        showUpperModal: false,
        comfirmLoading: false,
        showHistoryModal: false,
        upgradeHistory: [],
        classTeacher: {},
        showClassTeacherModal: false,
        classStudent: [],
        showClassStudent: false,
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            if (payload == null) {
                yield put({
                    type: 'setData',
                    payload: {
                        classList: []
                    }
                })
                return false;
            }

            // 缓存上一次请求参数
            lastFetchProps = payload;

            const res = yield call(getClassList, payload);
            yield put({
                type: 'setData',
                payload: {
                    classList: res.data
                }
            })
        },
        *getUpperClass({ payload }, { call, put }) {
            let config = {
                kindergartenCode: payload.kindergartenCode,
                gradeCode: {
                    'G0000000001': 'G0000000002',
                    'G0000000002': 'G0000000003',
                    'G0000000003': 'G0000000004',
                }[payload.gradeCode]
            }
            const res = yield call(getTheClass, config);
            yield put({
                type: 'setData',
                payload: {
                    showUpperModal: true,
                    upperClassList: res.data
                }
            })
        },
        *riseGrade({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    comfirmLoading: true
                }
            })
            const res = yield call(requestRiseGrade, payload);
            if (res.status === '1') {
                message.success('升年级成功')
            }

            yield put({
                type: 'setData',
                payload: {
                    showUpperModal: false
                }
            })
            yield put({
                type: 'fetch',
                payload: lastFetchProps
            })
            yield put({
                type: 'setData',
                payload: {
                    comfirmLoading: false
                }
            })
        },
        *getRiseHistory({ payload }, { call, put }) {
            const res = yield call(requestTheHistory, payload);
            yield put({
                type: 'setData',
                payload: {
                    showHistoryModal: true,
                    upgradeHistory: res.data
                }
            })
        },
        *getClassTeacher({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })

            // 获取在班的老师
            const tearcherIn = yield call(requestTeacherInClass, {
                classCode: payload.classCode,
            });
            // 获取不在班的老师
            const tearcherNotIn = yield call(requestTeacherNotInClass, {
                classCode: payload.classCode,
                kindergartenCode: payload.kindergartenCode
            });

            if (tearcherIn.status === '1' && tearcherNotIn.status === '1') {
                yield put({
                    type: 'setData',
                    payload: {
                        classTeacher: {
                            teacherIn: tearcherIn.data,
                            teacherNotIn: tearcherNotIn.data
                        },
                        showClassTeacherModal: true
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *deleteClass({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            // 删除老师
            const deleteRes = yield call(deleteClassByclassCode, { classCode: payload.classCode });
            if (deleteRes.status === '1') {
                message.success('删除班级成功')
            }
            yield put({
                type: 'fetch',
                payload: {
                    kindergartenCode: payload.kindergartenCode,
                    graduateFlag: payload.graduateFlag
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *deployTeachers({ payload }, { call, put }) {
            // 获取在班的老师
            yield put({
                type: 'setData',
                payload: {
                    showClassTeacherModal: false
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            const addRes = yield call(addTeacherToClass, {
                classCode: payload.classCode,
                teacherUidList: payload.add
            })
            const delRes = yield call(removeTeacherFromClass, {
                classCode: payload.classCode,
                teacherUid: payload.del
            })
            if (addRes.status === '1' && delRes.status === '1') {
                message.success('教师分配成功')
                yield put({
                    type: 'fetch',
                    payload: {
                        kindergartenCode: payload.kindergartenCode,
                        graduateFlag: true
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *fetchStudents({ payload }, { call, put }) {

            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })

            // 获取在班的老师
            const res = yield call(getStudentsByClass, {
                classCode: payload.classCode,
            });

            if (res.status === '1') {
                yield put({
                    type: 'setData',
                    payload: {
                        classStudent: res.data,
                        showClassStudent: true
                    }
                })
            }

            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })

        },
        *addStudent({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            // 添加学生
            const res = yield call(addStudentToClass, {
                uid: payload.uid,
                classCode: payload.classCode,
                childName: payload.childName,
                roleName: payload.roleName,
                customerName: payload.customerName,
            });
            if (res.status === '1') {
                message.success('添加学生成功')
            }
            yield put({
                type: 'fetch',
                payload: {
                    kindergartenCode: payload.kindergartenCode,
                    graduateFlag: payload.graduateFlag
                }
            })
            yield put({
                type: 'fetchStudents',
                payload: {
                    classCode: payload.classCode,
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
                }
            })
        },
        *deleteStudent({ payload }, { call, put }) {
            yield put({
                type: 'setData',
                payload: {
                    listLoading: true
                }
            })
            // 删除老师
            const deleteRes = yield call(deleteStudentFromClass, payload);
            if (deleteRes.status === '1') {
                message.success('删除学生成功')
            }
            yield put({
                type: 'fetchStudents',
                payload: {
                    classCode: payload.classCode,
                }
            })
            yield put({
                type: 'fetch',
                payload: {
                    kindergartenCode: payload.kindergartenCode,
                    graduateFlag: payload.graduateFlag
                }
            })
            yield put({
                type: 'setData',
                payload: {
                    listLoading: false
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
        },
    }
}
