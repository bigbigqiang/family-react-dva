import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Button, Select, Table, Pagination } from 'antd';
import { VIPAddModal } from '../../components/VIP'
import { getParameter } from '../../utils/utils';
import styles from './PresentList.less';
import moment from 'moment';

@connect(state => ({
    vipsend: state.vipsend
}))
export default class PresentList extends PureComponent {

    state = {
        modalVisible: false
    }

    getBatchList(args) {
        this.props.dispatch({
            type: 'vipsend/getVipBatchList',
            payload: {
                ...args
            }
        })
    }

    componentDidMount() {

        const type = getParameter('type');

        let args = {}

        if (!type || type !== 'back') {
            args = {
                pageIndex: 1,
                pageSize: 10
            }
            this.props.dispatch({
                type: 'vipsend/setData',
                payload: { batchCache: null }
            })
        } else {

        }

        this.getBatchList(args)
    }


    render() {

        let { vipsend: { listLoading, listLoadingText, batchCount, batchList, batchCache } } = this.props

        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col className={styles.rightButton}>
                        <Button type="primary" icon="plus-circle-o" loading={listLoading || false} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }} >
                            {listLoadingText || '添加赠送VIP'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        )

        const tableColumns = [
            {
                title: '批次',
                dataIndex: 'batch',
                key: 'batch'
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render(text) {
                    return text || '-'
                }
            }, {
                title: '赠送数量',
                dataIndex: 'sendAmount',
                key: 'sendAmount',
                width: 75
            }, {
                title: '赠送天数',
                dataIndex: 'days',
                key: 'days',
                width: 75
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text, record, index) => {
                    if (text) {
                        let result = new Date(text);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                },
                width: 95
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                className: styles.operation,
                render: (text, record, index) => {
                    return (
                        <Button type="primary">
                            <Link to={'present_list_detail?batch=' + record.batch}>查看</Link>
                        </Button>
                    )
                }
            }
        ]

        for (var key in tableColumns) {
            tableColumns[key].align = 'center'
        }

        return (
            <div>
                {toolbar}
                <Table
                    size="small"
                    rowKey="batch"
                    columns={tableColumns}
                    dataSource={batchList}
                    loading={listLoading}
                    footer={() => { return `共有数据：${batchCount}条` }}
                    bordered
                    pagination={{
                        total: batchCount,
                        showSizeChanger: true,
                        current: _.get(batchCache, 'pageIndex'),
                        pageSize: _.get(batchCache, 'pageSize'),
                        onChange: (pageIndex, pageSize) => {
                            this.getBatchList({ pageIndex, pageSize })
                        },
                        onShowSizeChange: (pageIndex, pageSize) => {
                            this.getBatchList({ pageIndex, pageSize })
                        }
                    }}
                />
                {!listLoading ? <VIPAddModal
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    //data CreateExcode组件返回的数据
                    onOk={(data) => {
                        data.sendMembers = data.sendMembers.join(',')
                        this.props.dispatch({
                            type: 'vipsend/presentVip',
                            payload: data
                        })
                        console.log('赠送VIP参数：', data)
                        this.setState({
                            modalVisible: false
                        })
                    }}
                /> : ''}
            </div>
        )
    }
}
