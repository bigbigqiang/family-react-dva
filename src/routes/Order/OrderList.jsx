import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Select, Icon, DatePicker, Table, Spin, message } from 'antd';
import { dict } from '../../utils/dict';
import styles from './OrderList.less';
import moment from 'moment';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;
@connect(state => ({
    order: state.order
}))
@Form.create()
export default class OrderList extends PureComponent {
    state = {
        moreCheck: false,
        page: 1,
        pageSize: 10,
        loading: false
    }

    handleFormValue() {
        const { getFieldsValue } = this.props.form;
        const values = getFieldsValue();
        let sendValues = {
            pageIndex: this.state.page,
            pageSize: this.state.pageSize
        };
        this.setState({ loading: true });
        switch (values.txtType) {
            case 1:
                sendValues.customerName = values.txt;
                break;
            case 2:
                sendValues.orderNo = values.txt;
                break;
            case 3:
                sendValues.kindergartenName = values.txt;
                break;
            case 4:
                sendValues.partnerName = values.txt;
                break;
            default:
                break;
        }
        if (this.state.moreCheck) {
            sendValues = {
                ...sendValues,
                goodsName: values.goodsName,
                orderStatus: values.orderStatus,
                paymentPlantform: values.paymentPlantform
            }
            if (values.timeType == 1) {
                if (values.time != null && values.time.length == 2) {
                    sendValues.orderSubmitStartDate = values.time[0].format('YYYY-MM-DD');
                    sendValues.orderSubmitEndDate = values.time[1].format('YYYY-MM-DD');
                }
            } else if (values.timeType == 2) {
                if (values.time != null && values.time.length == 2) {
                    sendValues.orderFinishStartDate = values.time[0].format('YYYY-MM-DD');
                    sendValues.orderFinishEndDate = values.time[1].format('YYYY-MM-DD');
                }
            }
        }
        return sendValues;
    }

    handleOk = () => {
        // console.log(sendValues);
        this.props.dispatch({
            type: 'order/getOrderList',
            payload: this.handleFormValue()
        }).then(() => { this.setState({ loading: false }) })
    }
    handleOutput() {
        let sendValues = this.handleFormValue();
        let that = this;
        console.log(sendValues)
        if (_.has(sendValues, 'orderSubmitEndDate') && _.has(sendValues, 'orderSubmitStartDate')) {
            that.props.dispatch({
                type: 'order/outPutOrderList',
                payload: sendValues
            }).then(() => { that.setState({ loading: false }) })
        } else {
            message.error('导出数据请先选择时间范围')
            that.setState({ loading: false })
        }

    }
    componentDidMount() {
        //加载页面获取筛选条件选项
        this.props.dispatch({
            type: 'order/getParams'
        })
        this.handleOk();
    }
    render() {
        const { getFieldDecorator, resetFields } = this.props.form;
        let { order: {
            orderList,
            count,
            paymentPlantform,
            orderStatus,
            goods
        } } = this.props;

        const columns = [{
            title: '订单编号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            align: 'center',
        }, {
            title: '用户帐号',
            dataIndex: 'customerName',
            align: 'center',
            width: 103
        }, {
            title: '所在幼儿园',
            dataIndex: 'kindergartenName',
            align: 'center',
        }, {
            title: '园长手机号',
            dataIndex: 'headmasterPhone',
            align: 'center',
            width: 103
        }, {
            title: '所属合伙人',
            dataIndex: 'partnerName',
            align: 'center'
        }, {
            title: '商品',
            dataIndex: 'goodsName',
            align: 'center',
            width: 65
        }, {
            title: '价格',
            dataIndex: 'orderAmount',
            align: 'center',
            width: 80,
            render(text) {
                return text + '￥'
            }
        }, {
            title: '支付渠道',
            dataIndex: 'payment',
            align: 'center',
            width: 90,
            render: (text, record) => {
                return dict('ORDER_' + text)
            }
        }, {
            title: <div>提交/完成时间</div>,
            align: 'center',
            width: 300,
            render: (text, record) => {
                return <div style={{ textAlign: 'left' }}>
                    <span title={moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span> /
                {record.finishedTime ? <span title={moment(record.finishedTime).format('YYYY-MM-DD HH:mm:ss')}> {moment(record.finishedTime).format('YYYY-MM-DD HH:mm:ss')}</span> : ' -'}
                </div>;
            }
        }, {
            title: '订单状态',
            align: 'center',
            dataIndex: 'orderStatus',
            width: 80,
            render: (text, record) => {
                return dict(text, {
                    type: 'badge',
                    prefix: 'ORDER'
                });
            }
        }];
        return (
            <div>
                <Form layout='inline'>
                    <Row className={styles.search_line}>
                        <Col>
                            <FormItem>
                                {getFieldDecorator('txtType', {
                                    initialValue: 1,
                                })(
                                    <Select>
                                        <Option value={1}>用户帐号</Option>
                                        <Option value={2}>订单编号</Option>
                                        <Option value={3}>所在幼儿园</Option>
                                        <Option value={4}>合伙人账号</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('txt', {
                                    initialValue: '',
                                })(
                                    <Search onSearch={() => {
                                        this.setState({
                                            page: 1
                                        }, () => this.handleOk());
                                    }} enterButton></Search>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" style={{ marginRight: '12px' }} onClick={() => resetFields()}>重置</Button>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={() => {
                                    this.setState({
                                        moreCheck: !this.state.moreCheck
                                    })
                                }}>更多条件{this.state.moreCheck ? <Icon type="up-circle-o" style={{ padding: '3px' }} /> : <Icon type="down-circle-o" style={{ padding: '3px' }} />}</Button>
                            </FormItem>
                        </Col>
                        {this.state.moreCheck ?
                            (
                                <div>
                                    <Col style={{ 'marginTop': '12px' }}>
                                        <FormItem>
                                            {getFieldDecorator('timeType', {
                                                initialValue: 1,
                                            })(
                                                <Select>
                                                    <Option value={1}>订单提交时间</Option>
                                                    <Option value={2}>订单完成时间</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem>
                                            {getFieldDecorator('time', {
                                                // initialValue: [moment(new Date('2018.06.01')),moment(new Date())],
                                            })(
                                                <RangePicker onChange={(dates) => {
                                                    console.log('选中的日期:', dates);
                                                }} />
                                            )}
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" onClick={() => {
                                                this.setState({
                                                    page: 1
                                                }, () => this.handleOk());
                                            }}>查询</Button>
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" onClick={() => {
                                                this.setState({
                                                    page: 1
                                                }, () => this.handleOutput());
                                            }}>导出</Button>
                                        </FormItem>
                                    </Col>
                                    <Col style={{ 'marginTop': '12px' }}>
                                        <FormItem label='支付渠道'>
                                            {getFieldDecorator('paymentPlantform', {
                                                initialValue: '',
                                            })(

                                                <Select style={{ width: '120px' }} onChange={(value) => {
                                                    // console.log(value)
                                                }}>
                                                    <Option value=''>全部</Option>
                                                    {
                                                        paymentPlantform.map((item, index) => {
                                                            return <Option key={index} value={item}>{dict('ORDER_' + item, true)}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label='订单状态'>
                                            {getFieldDecorator('orderStatus', {
                                                initialValue: '',
                                            })(
                                                <Select style={{ width: '120px' }}>
                                                    <Option value=''>全部</Option>
                                                    {
                                                        orderStatus.map((item, index) => {
                                                            return <Option key={index} value={item}>{dict('ORDER_' + item, true)}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label='商品'>
                                            {getFieldDecorator('goodsName', {
                                                initialValue: '',
                                            })(
                                                <Select style={{ width: '120px' }}>
                                                    <Option value=''>全部</Option>
                                                    {
                                                        goods.map((item, index) => {
                                                            return <Option key={index} value={item}>{item}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </div>
                            ) : ''
                        }

                    </Row>
                </Form>
                <Spin spinning={this.state.loading}>
                    <Table
                        columns={columns}
                        dataSource={orderList}
                        size='small'
                        bordered
                        pagination={{
                            current: this.state.page,
                            showQuickJumper: true,
                            total: count,
                            onChange: (page) => {
                                this.setState({
                                    page: page
                                }, () => this.handleOk());
                            }
                        }}
                    />
                </Spin>
            </div>
        )
    }
}
