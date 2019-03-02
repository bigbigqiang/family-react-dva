import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Table, Form, Button, Icon, Input, Select } from 'antd';
import styles from './UsedCodeList.less';
import moment from 'moment'

const { Search } = Input;
const { Option } = Select;
@connect(state => ({
    vipcode: state.vipcode
}))
@Form.create()
export default class UsedCodeList extends PureComponent {
    getUsedList(pageIndex, pageSize) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                this.props.dispatch({
                    type: 'vipcode/getUsedList',
                    payload: {
                        ...values,// 搜索类型和搜索值
                        "pageIndex": pageIndex,
                        "pageSize": pageSize
                    }
                })
            }
        })
    }

    componentDidMount() {
        this.getUsedList(1, 10)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { vipcode: { listLoading, codeUsedList, codeUsedListCount } } = this.props;
        const tableColumns = [
            {
                title: '序号',
                dataIndex: 'indexId',
                key: 'indexId',
            }, {
                title: '兑换码',
                dataIndex: 'cardCode',
                key: 'cardCode',
            }, {
                title: '兑换码类型',
                dataIndex: 'activeTime',
                key: 'activeTime',
            }, {
                title: '批次',
                dataIndex: 'batch',
                key: 'batch',
            }, {
                title: '兑换手机',
                dataIndex: 'phone',
                key: 'phone',
                width: 100
            }, {
                title: '所属幼儿园',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName',
                render(text){
                    return text || '-'
                }
            }, {
                title: '所属合伙人',
                dataIndex: 'partnerName',
                key: 'partnerName',
                render(text){
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

        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                    gutter={8}
                >
                    <Col span={4} >
                        {getFieldDecorator('searchType', {
                            initialValue: 'kindergartenName',
                        })(
                            <Select onChange={(value) => {
                                    // this.handleSearch({ status: value })
                                }} >
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
                                    this.getUsedList(1, 10)
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        )
        return (
            <div>
                {toolbar}
                <Table
                    size="small"
                    rowKey="indexId"
                    columns={tableColumns}
                    dataSource={codeUsedList}
                    loading={listLoading}
                    footer={() => { return `共有数据：${codeUsedListCount}条` }}
                    bordered
                    pagination={{
                        total: codeUsedListCount,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            this.getUsedList(page, pageSize)
                        },
                        onShowSizeChange: (current, size) => {
                            this.getUsedList(current, size)
                        }
                    }}
                />
            </div>
        )
    }
}