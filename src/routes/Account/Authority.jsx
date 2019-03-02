import React, { PureComponent } from 'react';
import { Row, Col, Table, Radio, Button, Icon, Form, Input, Select, Popconfirm } from 'antd';
import { connect } from 'dva';


import { RoleSelect, AuthoritySelect } from '../../components/Account'
import moment from 'moment';
import lodash from 'lodash';

import styles from './Authority.less';

const { Search } = Input;
const { Option } = Select;
const { Button: RadioButton, Group: RadioGroup } = Radio;

@connect(state => ({
    authority: state.authority
}))
@Form.create()
export default class Authority extends PureComponent {

    state = {
        listToShow: 'account',
        targetUser: '',
        targetRole: '',
    }

    getAccounts(props) {
        this.props.dispatch({
            type: 'authority/fetchAccounts',
            payload: {
                ...props
            }
        })
    }

    getRoles(props) {
        this.props.dispatch({
            type: 'authority/fetchRoles',
            payload: {
                ...props
            }
        })
    }

    getTheRole(code) {
        this.props.dispatch({
            type: 'authority/fetchTheRole',
            payload: {
                uniqueCode: code,
                uniqueType: 'HEADMASTER'
            }
        })
    }

    getTheAuthority(roleCode) {
        // 无论如何，都会先获取 空权限树
        // 如果有roleCode，则额外获取指定用户的权限数组
        this.props.dispatch({
            type: 'authority/fetchTheAuthority',
            payload: {
                roleCode
            }
        })
    }

    componentDidMount() {
        // 获取 成员列表、角色列表
        this.getAccounts({
            page: 0,
            pageSize: 10
        })
        this.getRoles({
            page: 0,
            pageSize: 10
        })
    }

    render() {

        const { authority: {
            accountsData,           // 成员列表
            rolesData,              // 角色列表
            theRole,                // 选定用户的角色数据，array
            listLoading,
            modalLoading,
            showRoleSelector,
            authorityTree,          // 权限树 array
            authorityData,          // 当前权限数据 object
            showAuthoritySelector
        } } = this.props;

        const accountColumns = [
            {
                title: '成员名称',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName'
            }, {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName'
            }, {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 102
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 100,
                render: (text, record) => {
                    let result = new Date(record.updateTime * 1);
                    return (
                        <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                    )
                },
            }, {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => {
                                //打开弹窗，并存储当前用户Code，用来设置role
                                this.setState({
                                    targetUser: record.kindergartenCode
                                })
                                this.getTheRole(record.kindergartenCode)
                            }}><Icon type="edit" theme="outlined" />编辑</Button>
                            <Popconfirm title="是否确定要删除该成员?" onConfirm={() => {
                                // 已约定，传空权限，即删除该成员
                                this.props.dispatch({
                                    type: 'authority/setTheRole',
                                    payload: {
                                        uniqueCode: record.kindergartenCode,
                                        uniqueType: 'HEADMASTER',
                                        roleCodeList: []
                                    }
                                })
                            }}>
                                <Button type="primary"><Icon type="delete" theme="outlined" />删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        for (var key in accountColumns) {
            accountColumns[key].align = 'center'
        }

        const roleColumns = [
            {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName'
            }, {
                title: '操作',
                key: 'operation',
                width: 150,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => {
                                //打开弹窗，并存储当前用户Code，用来设置role
                                this.setState({
                                    targetRole: record.roleCode
                                })
                                this.getTheAuthority(record.roleCode)
                            }}><Icon type="edit" theme="outlined" />编辑</Button>
                            <Popconfirm title="是否确定要删除该角色?" onConfirm={() => {
                                // 已约定，传空权限，即删除该成员
                                this.props.dispatch({
                                    type: 'authority/deleteTheRole',
                                    payload: {
                                        roleCode: record.roleCode,
                                    }
                                })
                            }}>
                                <Button type="primary" ><Icon type="delete" theme="outlined" />删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        for (var key in roleColumns) {
            roleColumns[key].align = 'center'
        }

        const { getFieldDecorator } = this.props.form;

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col >
                        <RadioGroup defaultValue="account" size="normal" onChange={(event) => {
                            this.setState({
                                listToShow: event.target.value
                            })
                        }}>
                            <RadioButton value="account">成员列表</RadioButton>
                            <RadioButton value="role">角色列表</RadioButton>
                        </RadioGroup>
                    </Col>
                    {this.state.listToShow === 'role' ? <Col>
                        <Button type="primary" onClick={() => {
                            this.setState({
                                targetRole: ''
                            })
                            this.getTheAuthority()
                        }}>
                            <Icon type="plus-circle-o" />添加角色
                        </Button>
                    </Col> : null}
                    <Col span={12}>
                        {getFieldDecorator('search', {
                            initialValue: '',
                        })(
                            <Search
                                placeholder="搜索"
                                onSearch={(values) => {
                                    // this.getUsedList(1, 10) // TODO: 重新获取列表
                                    if (this.state.listToShow === 'account')
                                        this.getAccounts({
                                            page: 0,
                                            pageSize: 10,
                                            searchParam: values
                                        });
                                    if (this.state.listToShow === 'role')
                                        this.getRoles({
                                            page: 0,
                                            pageSize: 10,
                                            searchParam: values
                                        });
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        )

        const accountList = (
            <Table
                rowKey="kindergartenCode"
                size="small"
                loading={listLoading}
                columns={accountColumns}
                dataSource={_.get(accountsData, 'memberList', [])}
                bordered
                pagination={{
                    size: "small",
                    total: _.get(accountsData, 'total', 0),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (page, pageSize) => {
                        this.getAccounts({ page: page - 1, pageSize })
                    },
                    onShowSizeChange: (page, pageSize) => {
                        this.getAccounts({ page: page - 1, pageSize })
                    }
                }}
            ></Table>
        )

        const roleList = (
            <Table
                rowKey="id"
                size="small"
                loading={listLoading}
                columns={roleColumns}
                dataSource={rolesData.roleList}
                bordered
                pagination={{
                    size: "small",
                    total: rolesData.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (page, pageSize) => {
                        this.getRoles({ page: page - 1, pageSize })
                    },
                    onShowSizeChange: (page, pageSize) => {
                        this.getRoles({ page: page - 1, pageSize })
                    }
                }}
            ></Table>
        )

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        {this.state.listToShow === 'account' ? accountList : roleList}
                    </Col>
                </Row>
                <RoleSelect
                    visible={showRoleSelector}
                    loading={modalLoading}
                    user={this.state.targetUser}
                    roleData={theRole}
                    onOk={(user, roleData) => {
                        this.props.dispatch({
                            type: 'authority/setTheRole',
                            payload: {
                                uniqueCode: user,
                                uniqueType: 'HEADMASTER',
                                roleCodeList: roleData
                            }
                        })
                    }}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'authority/setData',
                            payload: {
                                showRoleSelector: false
                            }
                        })
                    }}
                ></RoleSelect>
                <AuthoritySelect
                    visible={showAuthoritySelector}
                    loading={modalLoading}
                    roleCode={this.state.targetRole}
                    authorityTree={authorityTree}
                    authorityData={authorityData}
                    onOk={(data) => {
                        this.props.dispatch({
                            type: 'authority/setTheAuthority',
                            payload: data
                        })
                    }}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'authority/setData',
                            payload: {
                                showAuthoritySelector: false
                            }
                        })
                    }}
                ></AuthoritySelect>
            </div>
        )
    }
}
