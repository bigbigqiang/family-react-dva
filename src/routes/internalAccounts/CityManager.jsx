import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Modal, Icon, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router'
import moment from 'moment';
import { getParameter } from '../../utils/utils';
import { dict } from '../../utils/dict';
import styles from './CityManager.less';
import { AddManager } from '../../components/internalAccounts';

const Search = Input.Search;

@connect(state => ({
    cityManager: state.cityManager,
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
            type: 'cityManager/fetch',
            payload: {
                "searchParam": this.state.searchParam,
                "regionalManagerCode":getParameter('regionalManagerCode') || '',
                "pageVo": this.state.pageVo
            }
        })
    }

    getRegionalManagerList () {
        this.props.dispatch({
            type: 'cityManager/getRegionalManager'
        })
    }

    componentWillMount() {
        this.getRegionalManagerList()
        this.fetchList()
    }

    saveFormRef = (form) => {
        this.form = form; // 作为主页面，需要讲子component的form引用到主页面
    }

    handleSearchAccount = (keywords) => {
        this.props.dispatch({
            type: 'cityManager/fetch',
            payload: { keywords }
        })
    }

    cancelAddAccount = () => {
        const form = this.form;
        form.resetFields();
        this.props.dispatch({
            type: 'cityManager/setData',
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
                type: 'cityManager/save',
                payload: {
                    ...values,
                    uid
                }
            })
        });
    }

    showKGC = (key) => {
        this.props.dispatch({
            type: 'cityManager/showKGC',
            payload: key
        })
    }

    render() {

        const that = this;

        const columns = [
            {
                title: '工号',
                dataIndex: 'cityManagerNumber',
                key: 'cityManagerNumber'
            }, {
                title: '姓名',
                dataIndex: 'cityManagerName',
                key: 'cityManagerName'
            },
            {
                title: '区域',
                dataIndex: 'addressDesc',
                key: 'addressDesc'
            }, {
                title: '所属大区经理',
                dataIndex: 'regionalManagerName',
                key: 'regionalManagerName'
            },  {
                title: '合伙人',
                dataIndex: 'partnerCount',
                key: 'partnerCount',
                className: styles.amount,
                width: 59,
                render: (text, record) => {
                    return (
                        <Link
                            to={'../account/partner?cityManagerUid=' + record.uid}
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
                    let btnText = record.status === 'NORMAL' ? '停用' : '启用';
                    let btnType = record.status === 'NORMAL' ? 'primary' : 'default';

                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button onClick={() => {
                                that.props.dispatch({
                                    type: 'cityManager/queryOne',
                                    payload: record.uid
                                })
                            }} title="编辑" type="primary" >
                                <Icon type="edit" theme="outlined" />编辑
                            </Button>
                            <Popconfirm title={`请问是否确定要${btnText}该账户?`} onConfirm={() => {
                                this.props.dispatch({
                                    type: 'cityManager/changeStatus',
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

        const { cityManager: { cityManagerData, formloading, showAdd, init, nowUid, regionalManagerList} } = this.props;

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
                                type: 'cityManager/setData',
                                payload: {
                                    showAdd: true,
                                    nowUid: null,
                                    init: {}
                                }
                            })
                        }} >
                            <Icon type="plus-circle-o" />添加城市经理
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            size="small"
                            rowKey="id"
                            loading={formloading}
                            dataSource={cityManagerData.cityManagerList}
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
                            footer={() => { return `共有数据：${_.get(cityManagerData, 'total', 0)}条` }}
                            pagination={{
                                current: this.state.pageVo.page + 1,
                                total: _.get(cityManagerData, 'total', 0),
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
                    regionalManagerList={regionalManagerList.data}
                    init={init}
                    type='cityManager'
                    ref={this.saveFormRef}
                    onCancel={this.cancelAddAccount}
                    onOk={this.handleAddAccount}
                    nowUid={nowUid}
                />
            </div>
        )
    }
}
