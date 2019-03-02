import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, Input, Select, DatePicker, Popover, Modal, Message } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { Link } from 'dva/router';
import styles from './PartnerList.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

@connect(state => ({
    data: state.data
}))
@Form.create()
export default class PartnerList extends PureComponent {

    getPartnerList(args) {
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                this.props.dispatch({
                    type: "data/partnerList",
                    payload: {
                        ...values,
                        ...args,
                        selectDate: values.date.format('YYYY-MM')
                    }
                });
            }
        });
    }

    exPortPartner(args) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "data/exportPartnerList",
                    payload: {
                        ...values,
                        ...args,
                        selectDate: values.date.format('YYYY-MM')
                    }
                });
            }
        });
    }

    componentDidMount() {
        const type = getParameter('type');
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'data/setData',
                payload: { partnerDataCache: null }
            })
        }
        this.getPartnerList()
    }

    render() {
        const { getFieldDecorator, resetFields } = this.props.form;
        let { data: { partnerData, exPartnerData, listLoading, partnerDataCache } } = this.props;

        const columns = [
            {
                title: '合伙人名称',
                dataIndex: 'partnerName',
                key: 'partnerName'
            }, {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                width: 60
            }, {
                title: '幼儿园总数',
                dataIndex: 'kindergartenNum',
                key: 'kindergartenNum',
                className: styles.amount,
                width: 90,
                render: (text, record) => {
                    return (
                        <Link to={'./kinder_garten?partnerCode=' + record.partnerCode + ''} >
                            {record.kindergartenNum}
                        </Link >
                    )
                }
            }, {
                title: <div>有效家长数<Popover trigger="click" content='已登录过app的在园家长账号数'><Icon style={{ cursor: 'pointer', marginLeft: 10 }} type='question-circle' /></Popover></div>,
                dataIndex: 'validParentNum',
                key: 'validParentNum',

            }, {
                title: <div>本月新增幼儿园<Popover trigger="click" content='当前自然月新开通的园所账号数'><Icon style={{ cursor: 'pointer', marginLeft: 10 }} type='question-circle' /></Popover></div>,
                dataIndex: 'addKindergarten',
                key: 'addKindergarten'
            }, {
                title: <div>本月新增有效家长数<Popover trigger="click" content='当前自然月首次登录app的在园家长账号数'><Icon style={{ cursor: 'pointer', marginLeft: 10 }} type='question-circle' /></Popover></div>,
                dataIndex: 'addValidParentNum',
                key: 'addValidParentNum'
            }, {
                title: '本月已支付订单数',
                dataIndex: 'paidOrderNum',
            }, {
                title: '本月订单总金额',
                dataIndex: 'paidOrderAmount',
            }
        ].map(item => { return { ...item, align: 'center' } })

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" className={styles.search_line}>
                    <Col>
                        <FormItem>
                            {getFieldDecorator('partnerName', {
                                initialValue: _.get(partnerDataCache, 'partnerName')
                            })(
                                <Search placeholder="搜索" />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            {getFieldDecorator('date', {
                                initialValue: _.get(partnerDataCache, 'date', moment()),
                            })(
                                <MonthPicker
                                    format="YYYY-MM"
                                    onChange={() => {
                                        this.getPartnerList();
                                    }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button type="primary" onClick={() => {
                                this.getPartnerList({
                                    pageIndex: 1,
                                    pageSize: 10
                                });
                            }}>搜索</Button>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button type="primary" onClick={() => {
                                resetFields();
                                this.getPartnerList({
                                    partnerName: ''
                                })
                            }}>重置</Button>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem>
                            <Button type="primary" onClick={() => {
                                if (partnerData.count == 0) {
                                    Message.error('没有数据');
                                    return;
                                }
                                this.exPortPartner()
                            }}>导出</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        <Table
                            rowKey="partnerCode"
                            size="small"
                            columns={columns}
                            loading={listLoading}
                            dataSource={_.get(partnerData, 'list', [])}
                            bordered
                            className={styles.kinder_garden_list}
                            onChange={(pagination) => {
                                this.props.form.validateFields((err, values) => {
                                    this.getPartnerList({
                                        pageIndex: pagination.current,
                                        pageSize: pagination.pageSize,
                                    });
                                });
                            }}
                            pagination={{
                                total: _.get(partnerData, 'count', 0),
                                size: "small",
                                current: _.get(partnerDataCache, 'pageIndex', 1),
                                pageSize: _.get(partnerDataCache, 'pageSize', 10),
                                showSizeChanger: true,
                                showQuickJumper: true,
                            }}
                        // footer={() => { return `共有数据：${_.get(gardens, 'total', 0)}条` }}
                        ></Table>
                    </Col>
                </Row>
            </div>
        )
    }
}
