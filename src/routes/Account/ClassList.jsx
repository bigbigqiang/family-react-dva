import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, Input, Select, AutoComplete, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import { getParameter, cacheManager } from '../../utils/utils';
import { Link, routerRedux } from 'dva/router';
import { RiseGrade, UpgradeHistory, ClassTeacher, ClassStudent, MultipleAdd } from '../../components/Account'
import { server } from '../../utils/utils';
import { dict } from '../../utils/dict';
import moment from 'moment';
import styles from './ClassList.less';

const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    class: state.class,
    garden: state.garden
}))
@Form.create()
export default class ClassList extends PureComponent {

    state = {
        nowGarden: '',         // 园所登录时，以缓存中CGC为准，运营人员登录的时候，使用这个
        targetClass: {},
        showUploader: false
    }

    getClass(data) {

        const businessCode = getParameter('businessCode');
        let CGC = cacheManager.get('ellahome_CGC');

        if (CGC) {
            this.props.dispatch({
                type: 'class/fetch',
                payload: {
                    ...data,
                    kindergartenCode: CGC,
                    graduateFlag: true
                }
            })
        } else if (data) {
            this.props.dispatch({
                type: 'class/fetch',
                payload: {
                    ...data,
                    kindergartenCode: data.kindergartenCode || businessCode || null
                }
            })
        } else {
            this.props.dispatch({
                type: 'class/fetch',
                payload: businessCode ? {
                    kindergartenCode: businessCode
                } : null
            })
        }
    }

    componentDidMount() {

        const businessCode = getParameter('businessCode');  // 运营人员从其它页面跳转过来的情况
        const CGC = cacheManager.get('ellahome_CGC'); // 园所登录之后的值

        let gardenCode = CGC || businessCode;       // 运营人员登录后，搜索之后，设置的值
        this.props.dispatch({
            type: 'class/setData',
            payload: {
                classList: []
            }
        })
        // this.props.dispatch({
        //     type: 'garden/setData',
        //     payload: {
        //         cacheFilter: null
        //     }
        // })

        if (gardenCode) {
            this.getClass();
        }

    }

    render() {
        // 获取幼儿园Code
        const businessCode = getParameter('businessCode');  // 运营人员从其它页面跳转过来的情况
        const gardenName = getParameter('gardenName');  // 运营人员从其它页面跳转过来的情况
        const routeFrom = getParameter('from');

        // 园所登录之后的值
        const CGC = cacheManager.get('ellahome_CGC');
        let gardenCode = this.state.nowGarden || CGC || businessCode;       // 运营人员登录后，搜索之后，设置的值

        let { class: {
            listLoading,
            classList,                  // 班级列表
            upperClassList,             // 升年级弹框中，更高一级所有班级数据
            showUpperModal,             // 显示升年级弹窗
            comfirmLoading,             // 确认按钮loading
            showHistoryModal,           // 显示升班级历史弹框
            upgradeHistory,             // 生班级历史数据
            classTeacher,               // 班级教师数据
            showClassTeacherModal,       // 显示班级教师弹框
            classStudent,
            showClassStudent,
        } } = this.props;

        // 链接garden model 用于搜索指定幼儿园
        let {
            garden: {
                gardens, // 幼儿园列表
            }
        } = this.props;

        // 搜索定时器
        let searchTimeout = null;

        // 定义列表字段
        const columns = [
            {
                title: '班级',
                dataIndex: 'className',
                key: 'className'
            }, {
                title: '年级',
                dataIndex: 'gradeName',
                key: 'gradeName',
            }, {
                title: '入学年份',
                dataIndex: 'enrolYear',
                key: 'enrolYear',
                width: 73,
                render: (text, record) => {
                    return (
                        record.enrolYear ? <span title={record.enrolYear}>{record.enrolYear}</span> : '无数据'
                    )
                },
            }, {
                title: '教师',
                dataIndex: 'teacherNum',
                key: 'teacherNum',
                className: styles.amount,
                width: 45,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            })
                            this.props.dispatch({
                                type: 'class/getClassTeacher',
                                payload: {
                                    classCode: record.classCode,
                                    kindergartenCode: gardenCode
                                }
                            })
                        }}>
                            {record.teacherNum}
                        </a>
                    )
                }
            }, {
                title: '学生',
                dataIndex: 'parentNum',
                key: 'parentNum',
                className: styles.amount,
                width: 45,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.props.dispatch({
                                    type: 'class/fetchStudents',
                                    payload: {
                                        classCode: this.state.targetClass.classCode,
                                    }
                                })
                            })

                        }}>
                            {record.parentNum}
                        </a>
                    )
                }
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 95,
                render: (text, record) => {
                    let result = new Date(record.createTime * 1);
                    return (
                        record.createTime ? <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span> : '无数据'
                    )
                },
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 75,
                render: (text, record) => {
                    return dict(text, {
                        prefix: 'CLASS',
                        type: 'badge'
                    })
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 270,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    targetClass: record,
                                })
                                this.props.dispatch({
                                    type: 'class/getRiseHistory',
                                    payload: { classCode: record.classCode }
                                })
                            }}><Icon type="clock-circle" theme="outlined" />升年级历史</Button>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    targetClass: record,
                                })
                                this.props.dispatch({
                                    type: 'class/getUpperClass',
                                    payload: record
                                })
                            }}><Icon type="arrow-up" theme="outlined" />升年级</Button>
                            <Popconfirm title="是否确定删除班级?" onConfirm={() => {
                                this.props.dispatch({
                                    type: 'class/deleteClass',
                                    payload: {
                                        classCode: record.classCode,
                                        kindergartenCode: gardenCode,
                                        graduateFlag: true
                                    }
                                })
                            }} okText="是" cancelText="否">
                                <Button type="primary"  ><Icon type="delete" theme="outlined" />删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        for (var key in columns) {
            columns[key].align = 'center'
        }

        // 从搜索的幼儿园数据，生成自动完成的下拉列表，AutoComplete
        const gardenOptions = _.get(gardens, 'kindergartenList', []).map(item => {
            return <Option key={JSON.stringify({ code: item.kindergartenCode, name: item.kindergartenName })}>{item.kindergartenName}</Option>
        })

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    {businessCode ? <Col>
                        <Button type="default">
                            <Link to={`/account/${routeFrom}?type=back`}>
                                <Icon type="left" />返回幼儿园管理
                            </Link >
                        </Button>
                    </Col> : ''}
                    {!CGC ? <Col span={8}>
                        <AutoComplete
                            placeholder={businessCode ? `当前幼儿园 : ${window.decodeURI(gardenName)}` : "请先搜索并选定幼儿园"}
                            onChange={(values) => {
                                console.log(values)
                                let arg = '';
                                try {
                                    values = JSON.parse(values);
                                } catch (err) {

                                }
                                if (typeof values == 'string') {
                                    arg = values.replace(/\'/g, '');
                                } else if (typeof values == 'number') {

                                } else {
                                    arg = values.name.replace(/\'/g, '')
                                }
                                clearTimeout(searchTimeout)
                                searchTimeout = setTimeout(() => {
                                    this.props.dispatch({
                                        type: 'garden/fetch',
                                        payload: {
                                            searchParam: arg,
                                        }
                                    })
                                }, 300)
                            }}
                            onSelect={(values) => {
                                values = JSON.parse(values);
                                this.setState({
                                    nowGarden: values.code
                                })
                                this.getClass({
                                    kindergartenCode: values.code,
                                    graduateFlag: true
                                })
                                // this.props.dispatch(routerRedux.push(`/account/class?businessCode=${values.code}&gardenName=${values.name}`))
                            }}
                            enterButton
                        >
                            {gardenOptions}
                        </AutoComplete>
                    </Col> : ''}
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={() => {
                            if (gardenCode) {
                                this.setState({
                                    showUploader: true
                                })
                            } else {
                                message.warn('请先搜索幼儿园')
                            }
                        }}>
                            <Icon type="plus-circle-o" />批量导入
                        </Button>
                    </Col>
                </Row>
            </Form>
        )

        return (
            <div>
                {toolbar}
                <Table
                    rowKey="id"
                    size="small"
                    loading={listLoading}
                    columns={columns}
                    className={styles.kinder_garden_list}
                    dataSource={classList}
                    bordered
                    pagination={{
                        size: "small",
                        showSizeChanger: true,
                        showQuickJumper: true
                    }}
                    footer={() => {
                        return `班级： ${_.get(classList, 'length', 0)}`
                    }}
                />
                <RiseGrade
                    visible={showUpperModal}
                    loading={comfirmLoading}
                    classInfo={this.state.targetClass}
                    upperClass={upperClassList}
                    onOk={(values) => {
                        this.props.dispatch({
                            type: 'class/riseGrade',
                            payload: values
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            targetClass: {},
                        })
                        this.props.dispatch({
                            type: 'class/setData',
                            payload: {
                                showUpperModal: false
                            }
                        })
                    }}
                />
                <UpgradeHistory
                    visible={showHistoryModal}
                    historyData={upgradeHistory}
                    onOk={() => {
                        this.props.dispatch({
                            type: 'class/setData',
                            payload: {
                                showHistoryModal: false
                            }
                        })
                    }}
                />
                <ClassTeacher
                    visible={showClassTeacherModal}
                    loading={comfirmLoading}
                    classData={this.state.targetClass}
                    teacherData={classTeacher}
                    onOk={(classCode, add, del) => {
                        this.props.dispatch({
                            type: 'class/deployTeachers',
                            payload: {
                                kindergartenCode: gardenCode,
                                classCode,
                                add,
                                del
                            }
                        })
                    }}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'class/setData',
                            payload: {
                                showClassTeacherModal: false
                            }
                        })
                    }}
                />
                <ClassStudent
                    visible={showClassStudent}
                    studentData={classStudent}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'class/setData',
                            payload: {
                                showClassStudent: false
                            }
                        })
                    }}
                    onAdd={(data) => {
                        this.props.dispatch({
                            type: 'class/addStudent',
                            payload: {
                                ...data,
                                kindergartenCode: gardenCode,
                                graduateFlag: true
                            }
                        })
                    }}
                    onDel={(data) => {
                        this.props.dispatch({
                            type: 'class/deleteStudent',
                            payload: {
                                ...data,
                                kindergartenCode: gardenCode,
                                graduateFlag: true
                            }
                        })
                    }}
                />
                <MultipleAdd
                    visible={this.state.showUploader}
                    uploadText={'选择班级Excel文件进行批量上传'}
                    downloadText={'点击下载班级模板'}
                    uploadUrl={`${server.serverPath}/rest/importExcel/importClassNew`}
                    downloadUrl={`${server.serverPath}/rest/importExcel/downloadClassTemplate`}
                    meta={{
                        fileCode: gardenCode
                    }}
                    onCancel={() => {
                        this.setState({
                            showUploader: false
                        })
                    }}
                    onSuccess={() => {
                        this.setState({
                            showUploader: false
                        })
                        this.getClass();
                    }}
                />
            </div>
        )
    }
}
