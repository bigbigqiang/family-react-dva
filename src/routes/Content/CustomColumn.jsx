import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Button, Select, Icon, Table, Popconfirm, Input } from 'antd';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import styles from './CustomColumn.less'
import moment from 'moment';

const { Option } = Select;

@connect(state => ({
    customcolumn: state.customcolumn
}))
@Form.create()
export default class CustomColumn extends Component {

    getCustomColumnList(args) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'customcolumn/getCustomColumnList',
                    payload: {
                        ...values,
                        ...args
                    }
                })
            }
        })
    }

    deleteCoList(columnCode) {
        this.props.dispatch({
            type: 'customcolumn/deleteColumnList',
            payload: {
                columnCode: columnCode
            }
        })
    }

    componentDidMount() {
        const type = getParameter('type');
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'customcolumn/setData',
                payload: {
                    filterCache: {
                        pageIndex: 1,
                        pageSize: 10
                    }
                }
            })
        }
        this.getCustomColumnList()
    }
    // 图片上传处理--------------------
    render() {
        const typeName = {
            'BOOK_LIST': '图书列表',
        };
        const columns = [
            {
                title: '栏目名称 ',
                dataIndex: 'columnTitle',
                key: 'columnTitle   '

            }, {
                title: '栏目类型',
                dataIndex: 'targetType',
                key: 'targetType',
                align: 'center',
                render: (text, record) => {
                    return (
                        <span>{typeName[record.targetType]}</span>
                    )
                }
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                align: 'center',
                render: (text, record, index) => {
                    // console.log(text, record, index)
                    if (record.updateTime) {
                        let result = new Date(record.updateTime);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                }
            }, {
                title: '图书数量',
                dataIndex: 'bookCount',
                key: 'bookCount',
                align: 'center',

            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text, record) => {
                    return dict("CUSTCOL_" + text, {
                        type: 'badge'
                    })
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 150,
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button type="primary">
                                <Link to={"custom_edit?columnCode=" + record.columnCode}>
                                    <Icon type="edit" />编辑
                                </Link>
                            </Button>
                            <Popconfirm title="是否确定要删除该栏目?" onConfirm={() => {
                                this.deleteCoList(record.columnCode);
                            }}>
                                <Button type="primary" disabled={record.status == 'ON_LINE'}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        const { customcolumn: { columnLists, filterCache } } = this.props;
        const { getFieldDecorator } = this.props.form;

        const searchDom = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col>
                        {getFieldDecorator('columnTitle', {
                            initialValue: _.get(filterCache, 'columnTitle'),
                        })(
                            <Input.Search
                                onSearch={(value) => {
                                    this.getCustomColumnList({
                                        pageIndex: 1,
                                        pageSize: 10
                                    })
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                    <Col className={styles.rightButton}>
                        <Link to={"custom_edit"}>
                            <Button type="primary" >
                                <Icon type="plus-circle-o" />新建栏目
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Form>
        )

        return (
            <div>
                {searchDom}
                <Row>
                    <Col>
                        <Table
                            rowKey="columnCode"
                            size="small"
                            columns={columns}
                            dataSource={_.get(columnLists, 'customColumnList')}
                            bordered
                            onChange={(pagination, filter, sorter) => {
                                this.getCustomColumnList({
                                    pageIndex: pagination.current,
                                    pageSize: pagination.pageSize,
                                })
                            }}
                            pagination={{
                                size: "small",
                                total: _.get(columnLists, 'count'),
                                current: _.get(filterCache, 'pageIndex'),
                                pageSize: _.get(filterCache, 'pageSize'),
                                showSizeChanger: true,
                                showQuickJumper: true,
                            }}
                        ></Table>
                    </Col>
                </Row>


            </div >
        )
    }
}
