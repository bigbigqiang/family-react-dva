import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Badge, Icon, Form, Input, Select, Popconfirm } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { dict } from '../../utils/dict.js';
import { sec_to_time } from '../../utils/formata_se.js';
import { Link } from 'dva/router';
import { GardenDetail, RoleSelect, GardenSetting } from '../../components/Account';
import moment from 'moment';
import styles from './ListenList.less';
const { Search } = Input;
@connect(state => ({
    listenlist: state.listenlist,
}))
@Form.create()
export default class ListenList extends PureComponent {

    state = {
        filterCache: null,
        loading: false
    }

    getLbListenList(args) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'listenlist/getLbListenList',
                    payload: {
                        ...values,
                        ...args
                    }
                })
            }
        })
    }
    deleteLbListen(listenCode) {
        this.props.dispatch({
            type: 'listenlist/deleteLbListen',
            payload: {
                lbListenCode: listenCode,

            }
        })
    }

    componentDidMount() {
        const type = getParameter('type');
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'listenlist/setData',
                payload: {
                    filterCache: {
                        pageNum: 1,
                        pageSize: 10
                    }
                }
            })
        }
        this.getLbListenList()
    }

    render() {
        const { listenlist: { lbListenData, filterCache } } = this.props;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '听单名称',
                dataIndex: 'listenName',
                key: 'listenName',
            }, {
                title: '类型',
                dataIndex: 'listenType',
                key: 'listenType',
                width: 50,
                render(text) {
                    return dict(text, {
                        prefix: 'LISTENTYPE',
                    });
                }
            }, {
                title: '音频数量',
                dataIndex: 'voiceNum',
                key: 'voiceNum',
                width: 78
            }, {
                title: '总时长',
                dataIndex: 'voiceTotalTime',
                key: 'voiceTotalTime',
                width: 90,
                render(text) {
                    return sec_to_time(text)
                }
            }, {
                title: '展示状态',
                dataIndex: 'status',
                width: 100,
                render(text) {
                    return dict(text, {
                        prefix: 'GARDEN',
                        type: 'badge'
                    });
                }
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 100,
                render: (text, record) => {
                    if (!text) {
                        return ' - '
                    }
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button type="primary">
                                <Link to={"listen_edit?listenCode=" + record.listenCode}>
                                    <Icon type="form" />编辑
                                </Link>
                            </Button>
                            <Popconfirm title="是否确定要删除该横幅?" onConfirm={() => { this.deleteLbListen(record.listenCode) }}>
                                <Button type="primary" disabled={record.showStatus == 'YES'}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group >

                    )
                }
            }
        ]

        for (var key in columns) {
            columns[key].align = 'center'
        }

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={6}>
                        {getFieldDecorator('listenName', {
                            initialValue: _.get(filterCache, 'listenName', ''),
                        })(
                            <Search
                                placeholder="搜索"
                                onSearch={(values) => {
                                    this.getLbListenList()
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                    <Col className={styles.rightButton}>
                        <Link to={"listen_edit"}>
                            <Button type="primary">
                                <Icon type="plus-circle-o" />新建听单
                        </Button>
                        </Link>
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
                    columns={columns}
                    dataSource={_.get(lbListenData, 'list')}
                    className={styles.kinder_garden_list}
                    bordered
                    onChange={(pagination, filter, sorter) => {
                        this.getLbListenList({
                            pageNum: pagination.current,
                            pageSize: pagination.pageSize,
                        })
                    }}
                    pagination={{
                        size: "small",
                        total: _.get(lbListenData, 'total'),
                        current: _.get(filterCache, 'pageNum'),
                        pageSize: _.get(filterCache, 'pageSize'),
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                ></Table>
            </div>
        )
    }
}
