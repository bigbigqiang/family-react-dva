import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Modal, Icon, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './Operator.less';
import { Operator } from '../../components/internalAccounts';

const Search = Input.Search;

@connect(state => ({
    operator: state.operator,
    authority: state.authority.rolesData
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
            type: 'operator/fetch',
            payload: {
                "searchParam": this.state.searchParam,
                "pageVo": this.state.pageVo
            }
        })
    }

    requestRoles() {
        this.props.dispatch({
            type: 'authority/fetchRoles',
            payload: {
                page: 0,
                pageSize: 100
            }
        })
    }

    componentWillMount() {
        this.requestRoles()
        this.fetchList()
    }

    saveFormRef = (form) => {
        this.form = form; // 作为主页面，需要讲子component的form引用到主页面
    }

    cancelAddOperator = () => {
        const form = this.form;
        form.resetFields();
        this.props.dispatch({
            type: 'operator/setData',
            payload: {
                showAdd: false,
                nowUid: null,
                init: {},
            }
        })
    }

    handleAddOperator = (uid) => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            this.setState({
                searchParam:''
            })
            this.props.dispatch({
                type: 'operator/save',
                payload: {
                    ...values,
                    uid
                }
            })
        });
    }

    deleteOperator(uid) {
        this.props.dispatch({
            type: 'operator/deleteOperator',
            payload: {
                uid
            }
        })
    }

    showKGC = (key) => {
        this.props.dispatch({
            type: 'operator/showKGC',
            payload: key
        })
    }

    render() {

        const that = this;

        const columns = [
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 102
            }, {
                title: '姓名',
                dataIndex: 'operatorName',
                key: 'operatorName'
            }, {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName',
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            },
            {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button onClick={() => {
                                that.props.dispatch({
                                    type: 'operator/queryOne',
                                    payload: record.uid
                                })
                            }} type="primary" >
                                <Icon type="edit" theme="outlined" />编辑
                            </Button>
                            <Popconfirm title="是否确定要删除该运营人员?" onConfirm={() => { this.deleteOperator(record.uid) }}>
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

        const { operator: { operatorData, formloading, showAdd, init, nowUid }, authority } = this.props;

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
                                type: 'operator/setData',
                                payload: {
                                    showAdd: true,
                                    nowUid: null,
                                    init: {}
                                }
                            })
                        }} >
                            <Icon type="plus-circle-o" />添加运营人员
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            size="small"
                            rowKey="id"
                            loading={formloading}
                            dataSource={operatorData.operatorList}
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
                            footer={() => { return `共有数据：${_.get(operatorData, 'total', 0)}条` }}
                            pagination={{
                                current: this.state.pageVo.page + 1,
                                total: _.get(operatorData, 'total', 0),
                                size: "small",
                                pageSize: this.state.pageVo.pageSize,
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                        >
                        </Table>
                    </Col>
                </Row>
                <Operator
                    className={styles.addAccount}
                    visible={showAdd}
                    init={init}
                    roleList={authority.roleList}
                    ref={this.saveFormRef}
                    onCancel={this.cancelAddOperator}
                    onOk={this.handleAddOperator}
                    nowUid={nowUid}
                />
            </div>
        )
    }
}
