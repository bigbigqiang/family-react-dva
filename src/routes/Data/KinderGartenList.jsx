import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, Input, Select, Message, Popconfirm, message, DatePicker, Modal, Popover } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { Link } from 'dva/router';
import { SendTask, ActiveParent, FinishTask } from '../../components/Data'
import { server } from '../../utils/utils';
import moment from 'moment';
import styles from './KinderGartenList.less';
import lodash from 'lodash';

const { Search } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const { Item: FormItem } = Form;

@connect(state => ({
    data: state.data
}))
@Form.create()
export default class KinderGartenList extends PureComponent {

    state = {
        showUploader: false,
    }

    getKinderList(args) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "data/kinderList",
                    payload: {
                        selectDate: values.selectDate.format('YYYY-MM'),
                        kindergartenName: _.get(values, 'kindergartenName'),
                        partnerCode: getParameter('partnerCode'),
                        ...args
                    }
                });
            }
        });
    }

    exPortKinder(args) {
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type: "data/exportKinderList",
                payload: {
                    selectDate: values.selectDate.format('YYYY-MM'),
                    kindergartenName: _.get(values, 'kindergartenName'),
                    partnerCode: getParameter('partnerCode'),
                    ...args
                }
            });
        });
    }

    componentDidMount() {
        this.getKinderList()
    }

    render() {

        let { data: { kinderData, exKinderData, listLoading } } = this.props;
        const { getFieldDecorator, validateFields, resetFields } = this.props.form;

        const columns = [
            {
                title: '幼儿园名称',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName'
            }, {
                title: '家长总账号',
                dataIndex: 'kindergartenParentNum',
                key: 'kindergartenParentNum',
            }, {
                title: <div style={{ display: 'inline-block' }}>激活家长<Popover trigger="click" content='目前在园且有过app登录记录的家长数'><Icon style={{ cursor: 'pointer', marginLeft: 10 }} type='question-circle' /></Popover></div>,
                dataIndex: 'activateParentNum',
                key: 'activateParentNum',
                defaultSortOrder: 'descend',
                sorter: function (a, b) { }
            }, {
                title: <div style={{ display: 'inline-block' }}>本月新增有效家长数<Popover trigger="click" content='当前自然月首次登录app的在园家长账号数'><Icon style={{ cursor: 'pointer', marginLeft: 10 }} type='question-circle' /></Popover></div>,
                dataIndex: 'addValidParent',
                key: 'addValidParent',
                sorter: function (a, b) { }
            }, {
                title: '使用状态',
                dataIndex: 'status',
                key: 'status'
            }
        ]

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" className={styles.search_line}>
                    <FormItem>
                        <Button type="default">
                            <Link to='./partner?type=back'>
                                <Icon type="left" />返回合伙人数据
                            </Link >
                        </Button>
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('kindergartenName', {
                            initialValue: '',
                        })(
                            <Search
                                placeholder="幼儿园名字"
                                onSearch={() => {
                                    this.getKinderList();
                                }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('selectDate', {
                            initialValue: moment(),
                        })(
                            <MonthPicker
                                format="YYYY-MM"
                                allowClear={false}
                                onChange={(value) => {
                                    this.getKinderList({
                                        selectDate: value.format('YYYY-MM')
                                    });
                                }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => {
                            this.getKinderList()
                        }}>搜索</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => {
                            resetFields()
                            this.getKinderList()
                        }}>重置</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => {
                            if (kinderData.count == 0) {
                                Message.error('没有数据');
                                return false;
                            }
                            this.exPortKinder()
                        }}>导出</Button>
                    </FormItem>
                </Row>
            </Form>
        )

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        <Table
                            rowKey="kindergartenName"
                            size="small"
                            columns={columns}
                            loading={listLoading}
                            dataSource={_.get(kinderData, 'list', [])}
                            className={styles.kinder_garden_list}
                            bordered
                            onChange={(pagination, filter, sorter) => {
                                console.log(pagination, filter, sorter)

                                let args = {
                                    activateOrderBy: 'desc'
                                };

                                let order = 'desc';

                                if (_.has(sorter, 'order')) {
                                    order = {
                                        'descend': 'desc',
                                        'ascend': 'asc',
                                    }[_.get(sorter, 'order')]
                                }

                                if (_.get(sorter, 'field') === 'addValidParent') {
                                    args['validOrderBy'] = order;
                                    args['activateOrderBy'] = null;
                                } else if (_.get(sorter, 'field') === 'activateParentNum') {
                                    args['validOrderBy'] = null;
                                    args['activateOrderBy'] = order;
                                }

                                this.getKinderList({
                                    pageIndex: pagination.current,
                                    pageSize: pagination.pageSize,
                                    ...args
                                });
                            }}
                            pagination={{
                                total: _.get(kinderData, 'count', 0),
                                size: "small",
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                            footer={() => { return `共有数据：${_.get(kinderData, 'count', 0)}条` }}
                        ></Table>
                    </Col>
                </Row>
            </div>
        )
    }
}
