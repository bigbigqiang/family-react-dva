import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Modal, Icon, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router'
import moment from 'moment';
import { getParameter } from '../../utils/utils';
import { dict } from '../../utils/dict';
import styles from './Partner.less';
import { AddPartner } from '../../components/Account';

const Search = Input.Search;

@connect(state => ({
    account: state.account,
}))
export default class Partner extends PureComponent {

    state = {
        currentPage: 1
    }

    getCityManagerList () {
        this.props.dispatch({
            type: 'account/getCityManager'
        })
    }

    fetchList(pageIndex, pageSize) {
        this.props.dispatch({
            type: 'account/fetch',
            payload: {
                "cityManagerUid":getParameter('cityManagerUid') || '',
                "pageIndex": pageIndex,
                "pageSize": pageSize
            }
        })
    }

    componentWillMount() {
        this.getCityManagerList()
        this.fetchList(1, 10)
    }

    saveFormRef = (form) => {
        this.form = form; // 作为主页面，需要讲子component的form引用到主页面
    }

    handleSearchAccount = (keywords) => {
        this.props.dispatch({
            type: 'account/fetch',
            payload: { keywords }
        })
    }

    cancelAddAccount = () => {
        const form = this.form;
        form.resetFields();
        this.props.dispatch({
            type: 'account/setData',
            payload: {
                showAdd: false,
                nowUid: null,
                init: {},
            }
        })
    }

    handleAddAccount = (uid) => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            this.props.dispatch({
                type: 'account/save',
                payload: {
                    ...values,
                    uid
                }
            })
        });
    }

    showKGC = (key) => {
        this.props.dispatch({
            type: 'account/showKGC',
            payload: key
        })
    }

    render() {

        const that = this;

        const columns = [
            {
                title: '合伙人名称',
                width: 200,
                dataIndex: 'partnerName',
                key: 'partnerName'
            }, {
                title: '地域',
                width: 120,
                render(text, record) {
                    return record.province + '-' + record.city;
                }
            }, {
                title: '合伙人类型',
                dataIndex: 'partnerType',
                key: 'partnerType',
                width: 100,
                render(text) {
                    return dict(text, {
                        prefix: 'PARTNER',
                    })
                }
            }, {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 102
            }, {
                title: '所属城市经理',
                dataIndex: 'cityManagerName',
                key: 'cityManagerName',
                width: 102
            },{
                title: '幼儿园',
                className: styles.amount,
                width: 59,
                render: (text, record) => {
                    return (
                        <Link
                            to={'./garden?businessCode=' + record.uid}
                        >
                            {record.kindergartenNum}
                        </Link >
                        // TODO: <div onClick={() => { this.showKGC(record.key) }}>{record.kinder_garden_count}</div>
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                style: { color: '@success-color' },
                width: 60,
                render: (text) => {
                    return dict(text, { type: 'badge' })
                }
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 95,
                render: (text, record) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.createTime - b.createTime,
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 95,
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                },
                sorter: (a, b) => a.updateTime - b.updateTime,
            }, {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    let btnText = record.state === 'NORMAL' ? '停用' : '启用';
                    let btnType = record.state === 'NORMAL' ? 'primary' : 'default';

                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button onClick={() => {
                                that.props.dispatch({
                                    type: 'account/queryOne',
                                    payload: record.uid
                                })
                            }} title="编辑" type="primary" >
                                <Icon type="edit" theme="outlined" />编辑
                            </Button>
                            <Popconfirm title={`请问是否确定要${btnText}该账户?`} onConfirm={() => {
                                this.props.dispatch({
                                    type: 'account/changeStatus',
                                    payload: {
                                        uid: [record.uid],
                                        status: record.state === 'NORMAL' ? 'EXCEPTION' : 'NORMAL'
                                    }
                                })
                            }} okText="是" cancelText="否">
                                <Button type={btnType} title={btnText}>
                                    <Icon type={record.state === 'NORMAL' ? 'pause' : 'retweet'} theme="outlined" />{btnText}
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

        const { account: { accountData, formloading, showAdd, init, nowUid, cityManagerList } } = this.props;

        return (
            <div>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={18}>
                        <Search
                            placeholder="搜索"
                            onSearch={(values) => {
                                this.handleSearchAccount(values)
                                this.setState({
                                    currentPage: 1
                                })
                            }}
                            enterButton
                        />
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={() => {
                            that.props.dispatch({
                                type: 'account/setData',
                                payload: {
                                    showAdd: true,
                                    nowUid: null,
                                    init: {}
                                }
                            })
                        }} >
                            <Icon type="plus-circle-o" />添加合伙人
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            size="small"
                            rowKey="id"
                            loading={formloading}
                            dataSource={accountData}
                            columns={columns}
                            bordered
                            pagination={{
                                current: this.state.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                hideOnSinglePage: true,
                                onChange: (page) => {
                                    this.setState({
                                        currentPage: page
                                    })
                                }
                            }}
                        >
                        </Table>
                    </Col>
                </Row>
                <AddPartner
                    className={styles.addAccount}
                    visible={showAdd}
                    cityManagerList={cityManagerList.data}
                    init={init}
                    ref={this.saveFormRef}
                    onCancel={this.cancelAddAccount}
                    onOk={this.handleAddAccount}
                    nowUid={nowUid}
                />
            </div>
        )
    }
}
