import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Modal, Icon, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router'
import moment from 'moment';
import { dict } from '../../utils/dict';
import styles from './CityManager.less';
import { AddManager } from '../../components/internalAccounts';

const Search = Input.Search;

@connect(state => ({
    regionalManager: state.regionalManager,
}))
export default class Partner extends PureComponent {

    state = {
        searchParam: '',
        pageVo: {
            page: 0,
            pageSize: 10
        }
    }

    fetchList() {
        this.props.dispatch({
            type: 'regionalManager/fetch',
            payload: {
                "searchParam": this.state.searchParam,
                "pageVo": this.state.pageVo
            }
        })
    }

    componentWillMount() {
        this.fetchList()
    }

    saveFormRef = (form) => {
        this.form = form; // 作为主页面，需要讲子component的form引用到主页面
    }

    handleSearchAccount = (keywords) => {
        this.props.dispatch({
            type: 'regionalManager/fetch',
            payload: { keywords }
        })
    }

    cancelAddAccount = () => {
        const form = this.form;
        form.resetFields();
        this.props.dispatch({
            type: 'regionalManager/setData',
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
                type: 'regionalManager/save',
                payload: {
                    ...values,
                    uid
                }
            })
        });
    }

    showKGC = (key) => {
        this.props.dispatch({
            type: 'regionalManager/showKGC',
            payload: key
        })
    }

    render() {

        const that = this;

        const columns = [
            {
                title: '工号',
                dataIndex: 'regionalManagerNumber',
                key: 'regionalManagerNumber'
            }, {
                title: '姓名',
                dataIndex: 'regionalManagerName',
                key: 'regionalManagerName'
            },
            {
                title: '区域',
                dataIndex: 'addressDesc',
                key: 'addressDesc'
            }, {
                title: '城市经理',
                dataIndex: 'cityManagerCount',
                key: 'cityManagerCount',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <Link
                            to={'../internal_accounts/cityManager?regionalManagerCode=' + record.uid}
                        >
                            {text}
                        </Link >
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                style: { color: '@success-color' },
                width: 60,
                render: (text) => {
                    return dict(text, { type: 'badge' })
                }
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    let btnText = record.status === 'NORMAL' ? '停用' : '启用';
                    let btnType = record.status === 'NORMAL' ? 'primary' : 'default';

                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button onClick={() => {
                                that.props.dispatch({
                                    type: 'regionalManager/queryOne',
                                    payload: record.uid
                                })
                            }} title="编辑" type="primary" >
                                <Icon type="edit" theme="outlined" />编辑
                            </Button>
                            <Popconfirm title={`请问是否确定要${btnText}该账户?`} onConfirm={() => {
                                this.props.dispatch({
                                    type: 'regionalManager/changeStatus',
                                    payload: {
                                        uid: record.uid,
                                        status: record.status === 'NORMAL' ? 'EXCEPTION' : 'NORMAL',
                                        searchParam: this.state.searchParam,
                                        pageVo: {...this.state.pageVo}
                                    }
                                })
                            }} okText="是" cancelText="否">
                                <Button type={btnType} title={btnText}>
                                    <Icon type={record.status === 'NORMAL' ? 'pause' : 'retweet'} theme="outlined" />{btnText}
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

        const { regionalManager: { regionalManagerData, formloading, showAdd, init, nowUid} } = this.props;

        return (
            <div>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={18}>
                        <Search
                            placeholder="支持搜索工号，名称"
                            value = {this.state.searchParam}
                            onChange = {(e)=>{this.setState({searchParam:e.target.value})}}
                            onSearch={(values) => {
                                this.setState({
                                    searchParam: values,
                                    pageVo: {
                                        page: 0,
                                        pageSize: 10
                                    }
                                },()=>{this.fetchList()})
                            }}
                            enterButton
                        />
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={() => {
                            that.props.dispatch({
                                type: 'regionalManager/setData',
                                payload: {
                                    showAdd: true,
                                    nowUid: null,
                                    init: {}
                                }
                            })
                        }} >
                            <Icon type="plus-circle-o" />添加大区经理
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            size="small"
                            rowKey="id"
                            loading={formloading}
                            dataSource={regionalManagerData.regionalManagerList}
                            columns={columns}
                            bordered
                            onChange={(pagination, filter, sorter) => {
                                this.setState({
                                    pageVo: {
                                        page: pagination.current - 1,
                                        pageSize: pagination.pageSize
                                    }
                                },()=>{this.fetchList()})
                            }}
                            footer={() => { return `共有数据：${_.get(regionalManagerData, 'total', 0)}条` }}
                            pagination={{
                                current: this.state.pageVo.page + 1,
                                total: _.get(regionalManagerData, 'total', 0),
                                size: "small",
                                pageSize: this.state.pageVo.pageSize,
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                        >
                        </Table>
                    </Col>
                </Row>
                <AddManager
                    className={styles.addAccount}
                    visible={showAdd}
                    init={init}
                    type='regionalManager'
                    ref={this.saveFormRef}
                    onCancel={this.cancelAddAccount}
                    onOk={this.handleAddAccount}
                    nowUid={nowUid}
                />
            </div>
        )
    }
}
