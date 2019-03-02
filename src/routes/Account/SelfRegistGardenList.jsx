import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Badge, Icon, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict.js';
import { Link } from 'dva/router';
import { MessageConfirmModal } from '../../components/MessageConfirmModal';
import moment from 'moment';
import styles from './GardenList.less';

const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    garden: state.garden,
}))
@Form.create()
export default class SelfRegistGardenList extends PureComponent {

    state = {
        modalVisible: false,
        modal2Visible: false,
        gardenInfo: '',
    }

    getGardens(args) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'garden/fetchSelf',
                    payload: { ...values, ...args, openChannel: 'mine' }
                })
            }
        });
    }

    changeStatus(record) {
        let uid = cacheManager.get('uid')
        let { kindergartenCode, status } = record
        console.log(uid, record)
    }

    componentWillMount() {
        const type = getParameter('type');
        if (!type || type !== 'back') {
            this.props.dispatch({
                type: 'garden/setData',
                payload: {
                    selfCacheFilter: {
                        pageVo: {
                            page: 0,
                            pageSize: 10
                        }
                    },
                }
            })
        }
    }

    componentDidMount() {
        this.getGardens();
    }

    render() {

        const that = this;

        const businessCode = getParameter('businessCode') || null;
        const { getFieldDecorator } = this.props.form;
        const { garden: { gardens, messageModalVisible, selfCacheFilter } } = this.props;
        console.log(selfCacheFilter)

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
                title: '资料认证状态',
                dataIndex: 'certificationStatus',
                width: 85,
                render(text) {
                    return dict(text, {
                        type: 'badge',
                        prefix: 'GARDEN'
                    })
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
                width: 210,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary">
                                <Link
                                    to={`/account/garden_detail?from=self_regist_garden&kindergartenCode=${record.kindergartenCode}${businessCode ? '&businessCode=' + businessCode : ''}`}
                                >
                                    <Icon type="edit" />编辑
                                </Link >
                            </Button>

                            <Button type="primary" disabled={record.certificationStatus === 'NO_SUBMIT'}>
                                <Link
                                    to={`/account/garden_verify?from=self_regist_garden&kindergartenCode=${record.kindergartenCode}${businessCode ? '&businessCode=' + businessCode : ''}`}
                                >
                                    <Icon type="eye" />审核
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
                            <Link to={'./class?from=self_regist_garden&businessCode=' + record.kindergartenCode + '&gardenName=' + record.kindergartenName}>
                                班级数：<Button type="primary">{record.classNum}</Button>
                            </Link >
                        </Col>
                        <Col span={6}>
                            <Link to={'./teacher?from=self_regist_garden&businessCode=' + record.kindergartenCode + '&gardenName=' + record.kindergartenName}>
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
            <Form layout='inline' className={styles.search_line}>
                <Form.Item>
                    {getFieldDecorator('certificationStatus', {
                        initialValue: _.get(selfCacheFilter, 'certificationStatus', null),
                    })(
                        <Select>
                            <Option value={null}>全部</Option>
                            <Option value="NO_SUBMIT">未提交</Option>
                            <Option value="TO_AUDIT">待审核</Option>
                            <Option value="PASS">已通过</Option>
                            <Option value="NO_PASS">未通过</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('status', {
                        initialValue: _.get(selfCacheFilter, 'status', null),
                    })(
                        <Select>
                            <Option value={null}>全部</Option>
                            <Option value="TRIAL">试用</Option>
                            <Option value="NORMAL">可用</Option>
                            <Option value="DELETE">停用</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('searchParam', {
                        initialValue: _.get(selfCacheFilter, 'searchParam'),
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
                </Form.Item>
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
                        current: _.get(selfCacheFilter, 'pageVo.page') + 1,
                        pageSize: _.get(selfCacheFilter, 'pageVo.pageSize'),
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    footer={() => { return `共有数据：${_.get(gardens, 'total', 0)}条` }}
                ></Table>
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
