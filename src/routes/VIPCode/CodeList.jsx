import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Button, Icon, Select, Table, Pagination } from 'antd';
import styles from './CodeList.less';
import CreateExcode from '../../components/CreateExcode';
import { getParameter } from '../../utils/utils';
import moment from 'moment';

@connect(state => ({
    vipcode: state.vipcode
}))
@Form.create()
export default class CodeList extends PureComponent {

    state = {
        modalVisible: false
    }

    getBatchList(args) {
        this.props.dispatch({
            type: 'vipcode/getBatchList',
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
                type: 'vipcode/setData',
                payload: { batchCache: null }
            })
        } else {

        }

        this.getBatchList(args)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { vipcode: { batchList, batchCount, batchCache, listLoading, loadingText } } = this.props;
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col className={styles.rightButton}>
                        <Button type="primary" icon="plus-circle-o" loading={listLoading} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }} >
                            {loadingText || '生成兑换码'}
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
                key: 'remark'
            }, {
                title: '数量',
                dataIndex: 'totalCount',
                key: 'totalCount'
            }, {
                title: '类型',
                dataIndex: 'activeTime',
                key: 'activeTime'
            }, {
                title: '已兑换',
                dataIndex: 'useCount',
                key: 'useCount'
            }, {
                title: '生成时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 95,
                render: (text, record, index) => {
                    // console.log(text, record, index)
                    if (text) {
                        let result = new Date(text);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                            // < span > { result.getFullYear() } - { result.getMonth() + 1 } - { result.getDate() }</span >
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                },
                defaultSortOrder: 'descend',
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 150,
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary">
                                <Link to={'detail?batch=' + record.batch}>
                                    <Icon type="search" theme="outlined" />查看
                                </Link>
                            </Button>
                            <Button type="primary" onClick={() => {
                                window.open(record.excelUrl)
                            }}><Icon type="download" theme="outlined" />下载</Button>
                        </Button.Group>
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
                >
                </Table>
                {!listLoading ? <CreateExcode
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    //data CreateExcode组件返回的数据
                    onOk={(data) => {
                        this.props.dispatch({
                            type: 'vipcode/createCodeBatch',
                            payload: data
                        })
                        this.setState({
                            modalVisible: false
                        })
                    }}
                /> : ''}
            </div>
        )
    }
}
