/**
 * @description 兑换码详情列表 / 批次详情
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Table, Icon, Form, Select, Input } from 'antd';
import { getParameter } from '../../utils/urlHandle.js';
import styles from './CodeDetail.less'
import moment from 'moment'
const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    vipcode: state.vipcode
}))
@Form.create()
export default class CodeDetail extends PureComponent {

    getBatchDetailList(pageIndex, pageSize) {
        // TODO:
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                this.props.dispatch({
                    type: 'vipcode/getBatchDetail',
                    payload: {
                        ...values,// 搜索类型和搜索值
                        "batch": getParameter().batch,
                        "pageIndex": pageIndex,
                        "pageSize": pageSize,
                    }
                })
            }
        })
    }

    componentDidMount() {
        this.getBatchDetailList(1, 10)
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { vipcode: { batchDetailList, listLoading, batchDetailCount } } = this.props;
        const args = getParameter();
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                    gutter={8}
                >
                    <Col span={4} >
                        {getFieldDecorator('status', {
                            initialValue: ' ',
                        })(
                            <Select
                                onChange={(value) => {
                                    // this.handleSearch({ status: value })
                                }}
                            >
                                <Option value=" ">全部</Option>
                                <Option value="USED">已使用</Option>
                                <Option value="UNUSED">未使用</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={4} >
                        {getFieldDecorator('searchType', {
                            initialValue: 'kindergartenName',
                        })(
                            <Select
                                onChange={(value) => {
                                    // this.handleSearch({ status: value })
                                }}
                            >
                                <Option value="kindergartenName">幼儿园</Option>
                                <Option value="partnerName">合伙人</Option>
                                <Option value="indexId">兑换码序号</Option>
                                <Option value="cardCode">兑换码</Option>
                                <Option value="phone">手机号</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={8}>
                        {getFieldDecorator('search', {
                            initialValue: '',
                        })(
                            <Search
                                placeholder="搜索"
                                onSearch={(values) => {
                                    this.getBatchDetailList(1, 10)
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                    <Col className={styles.batch_code}>
                        当前批次：<span>{args.batch}</span>
                    </Col>
                </Row>
            </Form>
        )
        const bachBtn = (
            <Row>
                <Col>
                    <Link to="/vipcode/list?type=back">
                        <Button><Icon type="left" />返回兑换码管理</Button>
                    </Link>
                </Col>
            </Row>
        )
        const tableColumns = [
            {
                title: '兑换码序号',
                dataIndex: 'indexId',
                key: 'indexId',
            }, {
                title: '兑换码',
                dataIndex: 'cardCode',
                key: 'cardCode'
            }, {
                title: '兑换码类型',
                dataIndex: 'activeTime',
                key: 'activeTime'
            }, {
                title: '兑换手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 100
            }, {
                title: '所属幼儿园',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName',
                render(text) {
                    return text || '-'
                }
            }, {
                title: '所属合伙人',
                dataIndex: 'partnerName',
                key: 'partnerName',
                render(text) {
                    return text || '-'
                }
            }, {
                title: '兑换时间',
                dataIndex: 'useTime',
                key: 'useTime',
                width: 95,
                render: (text, record, index) => {
                    // console.log(text, record, index)
                    if (record.useTime) {
                        let result = new Date(record.useTime);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                        )
                    } else {
                        return (
                            <span>尚未兑换</span>
                        )
                    }
                },
                defaultSortOrder: 'descend',
            }, {
                title: '过期时间',
                dataIndex: 'expireTime',
                key: 'expireTime',
                width: 95,
                render: (text, record, index) => {
                    // console.log(text, record, index)
                    if (record.expireTime) {
                        let result = new Date(record.expireTime);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                },
                defaultSortOrder: 'descend',
            }
        ]

        for (var key in tableColumns) {
            tableColumns[key].align = 'center'
        }

        return (
            <div>
                {bachBtn}
                {toolbar}
                <Table
                    size="small"
                    rowKey="indexId"
                    columns={tableColumns}
                    dataSource={batchDetailList}
                    loading={listLoading}
                    footer={() => { return `共有数据：${batchDetailCount}条` }}
                    bordered
                    pagination={{
                        total: batchDetailCount,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            this.getBatchDetailList(page, pageSize)
                        },
                        onShowSizeChange: (current, size) => {
                            this.getBatchDetailList(current, size)
                        }
                    }}
                >
                </Table>
            </div >
        )
    }
}
