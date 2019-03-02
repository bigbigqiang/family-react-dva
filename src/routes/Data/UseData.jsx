import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, Input, Select, DatePicker, Spin, message } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { Link } from 'dva/router';
import { ActiveTeacher, SendTeacher } from '../../components/Data'
import moment from "moment";
import styles from './UseData.less';

const { Search } = Input;
const { Option } = Select;
const { Item: FormItem } = Form;
const { RangePicker } = DatePicker;
@connect(state => ({
    data: state.data
}))
@Form.create()
export default class GardenList extends PureComponent {

    state = {
        targetClass: {},
        showActiveTeacher: false,
        showSendTeacher: false,
    }
    KindergartenList(args) {
        this.props.dispatch({
            type: "data/KindergartenData",
            payload: args
        });
    }
    getExportKindergartenDatas(args) {
        this.props.dispatch({
            type: "data/exportKindergartenDatas",
            payload: args
        });
    }

    componentDidMount() {
        const type = getParameter('type');
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'data/setData',
                payload: { useDataCache: null }
            })
        }
        this.KindergartenList()
    }

    render() {
        const { getFieldDecorator, validateFields, resetFields } = this.props.form;
        const { data: { Kindergartens, acTeachers, seTeachers, listLoading, useDataCache } } = this.props;

        console.log(useDataCache);

        const columns = [
            {
                title: '幼儿园',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName'
            }, {
                title: '园长手机号',
                dataIndex: 'headmasterPhone',
                key: 'headmasterPhone'
            }, {
                title: '对应合伙人',
                dataIndex: 'partnerName',
                key: 'partnerName'
            }, {
                title: '班级',
                dataIndex: 'classNum',
                key: 'classNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <Link
                            to={'./garten_detail?businessCode=' + record.kindergartenCode + '&gardenName=' + record.kindergartenName}
                        >
                            {record.classNum}
                        </Link >
                    )
                }
            }, {
                title: '课程卡',
                dataIndex: 'vipCardNum',
                key: 'vipCardNum'
            }, {
                title: '教师',
                dataIndex: 'teacherNum',
                key: 'teacherNum',
                className: styles.amount,

            }, {
                title: '活跃教师',
                dataIndex: 'activeTeacherNum',
                key: 'activeTeacherNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.setState({
                                    showActiveTeacher: true
                                });
                                validateFields((err, values) => {
                                    if (!err) {
                                        this.props.dispatch({
                                            type: 'data/activeTeachers',
                                            payload: {
                                                kindergartenCode: this.state.targetClass.kindergartenCode,
                                                'startDate': values.date[0].format('YYYY-MM-DD'),
                                                'endDate': values.date[1].format('YYYY-MM-DD'),
                                            }
                                        })
                                    }
                                })
                            })

                        }}>
                            {record.activeTeacherNum}
                        </a>
                    )
                }
            }, {
                title: '发作业老师',
                dataIndex: 'sendHomeTaskTeacherNum',
                key: 'sendHomeTaskTeacherNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.setState({
                                    showSendTeacher: true
                                });
                                validateFields((err, values) => {
                                    if (!err) {
                                        this.props.dispatch({
                                            type: 'data/sendTeachers',
                                            payload: {
                                                kindergartenCode: this.state.targetClass.kindergartenCode,
                                                'startDate': values.date[0].format('YYYY-MM-DD'),
                                                'endDate': values.date[1].format('YYYY-MM-DD'),
                                            }
                                        })
                                    }
                                })
                            })

                        }}>
                            {record.sendHomeTaskTeacherNum}
                        </a>
                    )
                }
            }, {
                title: '发送作业',
                dataIndex: 'sendHomeTaskNum',
                key: 'sendHomeTaskNum',

            }, {
                title: '家长',
                dataIndex: 'parentNum',
                key: 'parentNum',

            },
            {
                title: '活跃家长',
                dataIndex: 'activeParentNum',
                key: 'activeParentNum',
                className: styles.amount,
            },
            {
                title: '完成作业家长',
                dataIndex: 'performHomeTaskParentNum',
                key: 'performHomeTaskParentNum',
                className: styles.amount,
            }
        ]

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" className={styles.search_line}>
                    <Col>
                        <FormItem>
                            {getFieldDecorator('searchType', {
                                initialValue: _.get(useDataCache, 'searchType', 'kgName'),
                            })(
                                <Select>
                                    <Option value="kgName">园所名称</Option>
                                    <Option value="partnerName">合伙人名称</Option>
                                    <Option value="headmasterPhone">园长手机</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col >
                        <FormItem>
                            {getFieldDecorator('searchTxt', {
                                initialValue: _.get(useDataCache, 'searchTxt', ''),
                            })(
                                <Search placeholder="搜索" />
                            )}
                        </FormItem>
                    </Col>
                    <Col >
                        <FormItem>
                            {getFieldDecorator('date', {
                                initialValue: _.get(useDataCache, 'date', [moment().startOf('month'), moment()]),
                            })(
                                <RangePicker style={{ width: 210 }} format='YYYY/MM/DD' allowClear={false} />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button htmlType="submit" type="primary" onClick={() => {
                                validateFields((err, values) => {
                                    if (!err) {
                                        let args = {
                                            ...values,
                                            'kgName': '',
                                            'partnerName': '',
                                            'headmasterPhone': '',
                                            'startDate': values.date[0].format('YYYY-MM-DD'),
                                            'endDate': values.date[1].format('YYYY-MM-DD'),
                                            'pageIndex': 1,
                                            'pageSize': 10
                                        };
                                        args[values.searchType] = values.searchTxt;
                                        this.KindergartenList(args)
                                    }
                                })
                            }}>搜索</Button>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button type="primary" onClick={() => {
                                resetFields();
                                this.props.dispatch({
                                    type: 'data/setData',
                                    payload: { useDataCache: null }
                                })
                                this.KindergartenList()
                            }}>重置</Button>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button type="primary" onClick={() => {
                                validateFields((err, values) => {
                                    if (!err) {
                                        let args = {
                                            'kgName': '',
                                            'partnerName': '',
                                            'headmasterPhone': '',
                                            'startDate': values.date[0].format('YYYY-MM-DD'),
                                            'endDate': values.date[1].format('YYYY-MM-DD')
                                        };
                                        args[values.searchType] = values.searchTxt;
                                        if (values.searchTxt === '') {
                                            message.warn('导出之前请先进行搜索')
                                            return false;
                                        } else {
                                            this.getExportKindergartenDatas(args)
                                        }
                                    }
                                })
                            }}>导出</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
        return (
            <Spin spinning={listLoading}>
                {toolbar}
                <Row>
                    <Col className={styles.dataTable}>
                        <Table
                            rowKey="kindergartenCode"
                            size="small"
                            bordered
                            columns={columns}
                            dataSource={_.get(Kindergartens, 'kindergartenData')}
                            className={styles.kinder_garden_list}
                            onChange={(pagination) => {
                                this.KindergartenList({
                                    pageIndex: pagination.current,
                                    pageSize: pagination.pageSize
                                })
                            }}
                            pagination={{
                                total: _.get(Kindergartens, 'count', 0),
                                size: "small",
                                current: _.get(useDataCache, 'pageIndex', 1),
                                pageSize: _.get(useDataCache, 'pageSize', 10),
                                showSizeChanger: true,
                                showQuickJumper: true,
                            }}
                            footer={() => { return `共有数据：${_.get(Kindergartens, 'count')}条` }}
                        ></Table>
                    </Col>
                </Row>
                <ActiveTeacher
                    visible={this.state.showActiveTeacher}
                    acTeacherData={acTeachers}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.setState({
                            showActiveTeacher: false
                        })
                    }}
                />
                <SendTeacher
                    visible={this.state.showSendTeacher}
                    sendTeacherData={seTeachers}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.setState({
                            showSendTeacher: false
                        })
                    }}
                />
            </Spin>
        )
    }
}
