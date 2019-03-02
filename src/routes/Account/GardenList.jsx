import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Badge, Icon, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict.js';
import { Link } from 'dva/router';
import { GardenDetail, RoleSelect, GardenSetting } from '../../components/Account';
import { MessageConfirmModal } from '../../components/MessageConfirmModal';
import moment from 'moment';
import styles from './GardenList.less';

const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    garden: state.garden,
    authority: state.authority
}))
@Form.create()
export default class GardenList extends PureComponent {

    state = {
        modalVisible: false,
        modal2Visible: false,
        gardenInfo: '',
    }

    getGardens(args) {
        const type = getParameter('type') || null;
        this.props.form.setFieldsInitialValue({
            searchParam: null
        })
        this.props.form.validateFields((err, values) => {
            values.searchParam = (!type || type !== 'back') ? values.searchParam : this.props.garden.cacheFilter.searchParam
            if (!err) {
                this.props.dispatch({
                    type: 'garden/fetch',
                    payload: { ...values, ...args, openChannel: ''}
                })
            } else {
                conosle.log(err);
            }
        });

    }

    getTheRole(code) {
        this.props.dispatch({
            type: 'authority/fetchTheRole',
            payload: {
                uniqueCode: code,
                uniqueType: 'HEADMASTER',
            }
        })
    }

    changeStatus(record) {
        console.log(record)
    }

    resetCacheFilter () {
        const type = getParameter('type') || null;
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'garden/setData',
                payload: {
                    cacheFilter: {
                        pageVo: {
                            page: 0,
                            pageSize: 10
                        }
                    }
                }
            })
        }
    }

    componentDidMount() {
        this.resetCacheFilter();
        const businessCode = getParameter('businessCode') || null;
        this.getGardens({ businessCode });
    }

    render() {

        const that = this;

        const businessCode = getParameter('businessCode') || null;
        
        const { getFieldDecorator } = this.props.form;
        const { garden: { gardens, settingInfo, messageModalVisible, cacheFilter } } = this.props;
        

        const { authority: {
            theRole,                // 选定用户的角色数据，array
            modalLoading,
            showRoleSelector,
        } } = this.props;

        const columns = [
            {
                title: '幼儿园',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName'
            }, {
                title: '所属合伙人',
                dataIndex: 'partnerName',
                key: 'partnerName',
                render(text) {
                    return text || '-'
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 65,
                render(text) {
                    return dict(text, {
                        prefix: 'GARDEN',
                        type: 'badge'
                    });
                }
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
                render: (text, record) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 145,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary">
                                <Link
                                    to={`/account/garden_detail?from=garden&kindergartenCode=${record.kindergartenCode}${businessCode ? '&businessCode=' + businessCode : ''}`}
                                >
                                    <Icon type="edit" />编辑
                                </Link >
                            </Button>

                            <Button type={record.status === "NORMAL" ? 'primary' : 'default'} onClick={() => {
                                that.setState({
                                    target: record
                                })
                                that.props.dispatch({
                                    type: 'garden/setData',
                                    payload: {
                                        messageModalVisible: true
                                    }
                                })
                            }}>
                                <Icon type={record.status === "NORMAL" ? 'pause' : 'retweet'} />{record.status === "NORMAL" ? '停用' : '启用'}
                            </Button>
                        </Button.Group >
                    )
                }
            }
        ]

        const expandRow = function (record) {
            return (
                <div>
                    <Row>
                        <Col span={6} push={1}>手机号：{record.phone}</Col>
                        <Col span={6}>幼儿园地址：{record.kindergartenAddress}</Col>
                    </Row>
                    <Row>
                        <Col span={6} push={1}>
                            <Link to={'./class?from=garden&businessCode=' + record.kindergartenCode + '&gardenName=' + record.kindergartenName}>
                                班级数：<Button type="primary">{record.classNum}</Button>
                            </Link >
                        </Col>
                        <Col span={6}>
                            <Link to={'./teacher?from=garden&businessCode=' + record.kindergartenCode + '&gardenName=' + record.kindergartenName}>
                                教师数：<Button type="primary">{record.teacherNum}</Button>
                            </Link >
                        </Col>
                        <Col span={6}>
                            家长数：<Button type="default">{record.parentNum}</Button>
                        </Col>
                    </Row>
                </div>
            )
        }

        for (var key in columns) {
            columns[key].align = 'center'
        }

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={12}>
                        {getFieldDecorator('searchParam', {
                            initialValue: _.get(cacheFilter, 'searchParam'),
                        })(
                            <Search
                                placeholder="搜索"
                                onSearch={() => {
                                    this.getGardens({
                                        pageVo: {
                                            page: 0,
                                            pageSize: 10
                                        }
                                    })
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
                    rowKey="id"
                    size="small"
                    columns={columns}
                    dataSource={_.get(gardens, 'kindergartenList', [])}
                    className={styles.kinder_garden_list}
                    bordered
                    expandedRowRender={expandRow}
                    onChange={(pagination, filter, sorter) => {
                        this.getGardens({
                            businessCode,
                            pageVo: {
                                page: pagination.current - 1,
                                pageSize: pagination.pageSize
                            }
                        })
                    }}
                    pagination={{
                        total: _.get(gardens, 'total', 0),
                        size: "small",
                        current: _.get(cacheFilter, 'pageVo.page') + 1,
                        pageSize: _.get(cacheFilter, 'pageVo.pageSize'),
                        showSizeChanger: true,
                        showQuickJumper: true
                    }}
                    footer={() => { return `共有数据：${_.get(gardens, 'total', 0)}条` }}
                ></Table>
                <GardenDetail
                    visible={this.state.modalVisible}
                    gardenInfo={this.state.gardenInfo}
                    roleInfo={theRole}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    authorityHandle={(gardenInfo) => {
                        this.getTheRole(gardenInfo.kindergartenCode)
                        this.setState({
                            targetUser: gardenInfo.kindergartenCode,
                            modalVisible: false
                        })
                    }}
                />
                <RoleSelect
                    visible={showRoleSelector}
                    loading={modalLoading}
                    user={this.state.targetUser}
                    roleData={theRole}
                    onOk={(user, roleData) => {
                        // console.log(user, roleData)
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
                            type: 'authority/showRoleSelector',
                            payload: false
                        })
                    }}
                ></RoleSelect>
                <GardenSetting
                    visible={this.state.modal2Visible}
                    settingInfo={settingInfo}
                    onCancel={() => {
                        this.setState({
                            modal2Visible: false
                        })
                    }}
                ></GardenSetting>
                <MessageConfirmModal
                    visible={messageModalVisible}
                    sendMessage={(phone) => {
                        that.props.dispatch({
                            type: 'garden/sendMessage',
                            payload: {
                                mobile: phone,
                                type: '4'
                            }
                        })
                    }}
                    onCancel={() => {
                        that.props.dispatch({
                            type: 'garden/setData',
                            payload: {
                                messageModalVisible: false
                            }
                        })
                    }}
                    onOk={(phone, code) => {
                        that.props.dispatch({
                            type: 'garden/updateGardenStatus',
                            payload: {
                                uid: cacheManager.get('uid'),
                                kindergartenCode: this.state.target.kindergartenCode,
                                status: this.state.target.status === "NORMAL" ? "DELETED" : "NORMAL",
                                checkCode: code,
                                mobilePhone: phone
                            }
                        })
                    }}
                ></MessageConfirmModal>
            </div>
        )
    }
}
