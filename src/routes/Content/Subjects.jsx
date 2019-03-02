import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Button, Select, Icon, Table, Tooltip, message } from 'antd';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import styles from './Subjects.less';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { PropTypes } from 'prop-types';

const { Option } = Select;

@connect(state => ({
    subjects: state.subjects
}))
@Form.create()
export default class Subjects extends PureComponent {

    /**
     * @param type 筛选类型，条件,Select组件切换值时传入
     */
    getSubjectList = (args) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'subjects/fetchList',
                    payload: {
                        ...values,
                        ...args
                    }
                })
            }
        });
    }

    /**
     * @description 上下线一条专题
     * 同时，需要记录当前的筛选条件，方便更新状态后的刷新用
     */
    modifyState = (publishFlag, topicCode) => {
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'subjects/modifyState',
                    payload: {
                        publishFlag,
                        topicCode,
                        backType: values.status, // 这个publishFlag是工具条上用来筛选的按个，并非本条的
                    }
                })
            } else {
                // console.log(err);
            }
        });
    }
    setSubjectsOrder = (topicCode, moveType) => {
        this.props.dispatch({
            type: 'subjects/setSubjectsOrder',
            payload: {
                moveCode: topicCode,
                moveType: moveType
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
                type: 'garden/setData',
                payload: { subjectCache: null }
            })
        }
        this.getSubjectList(args)
    }

    render() {
        const that = this;
        const { getFieldDecorator } = this.props.form;
        const { subjects: { subjectData, listLoading, subjectCache } } = this.props;

        // console.log(this)
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col span={4} >
                        {getFieldDecorator('status', {
                            initialValue: _.get(subjectCache, 'status', null),
                        })(
                            <Select
                                onChange={(value) => {
                                    this.getSubjectList({
                                        status: value,
                                        pageIndex: 1,
                                        pageSize: 10
                                    });
                                }}
                            >
                                <Option value={null}>全部</Option>
                                <Option value="NORMAL">已上线</Option>
                                <Option value="OFF_LINE">已下线</Option>
                                <Option value="EXCEPTION">草稿</Option>
                            </Select>
                        )}
                    </Col>
                    <Col className={styles.rightButton}>
                        <Link to={"subjects_edit"}>
                            <Button type="primary" onClick={this.showAddModal} >
                                <Icon type="plus-circle-o" />添加专题
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Form>
        )

        const tableColumns = [
            {
                title: '专题封面',
                dataIndex: 'topicImg',
                className: styles.list_cover,
                render: (text, record, index) => {
                    return (
                        <img src={text} alt="" />
                    )
                }
            }, {
                title: '专题标题',
                dataIndex: 'topicTitle',
                key: 'topicTitle',
            }, {
                title: '链接',
                dataIndex: 'targetPage',
                className: styles.link_style,
                render: (text, record, index) => {
                    let link = 'http://' + window.location.host + window.location.pathname + 'h5/subject_redirect.html' + '?topicCode=' + record.topicCode;
                    return (
                        <a title="点击复制到剪贴板" onClick={() => {
                            copy(link)
                            message.success('已成功复制到剪贴板')
                        }}>点击复制专题链接</a>
                    )
                }
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 90,
                render: (text, record, index) => {
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
                title: '状态',
                dataIndex: 'status',
                width: 90,
                render(text) {
                    return dict('SUBJECT_' + text, {
                        type: 'badge'
                    });
                }
            }, {
                title: '位置操作',
                width: 95,
                render(text, record) {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() =>
                                that.setSubjectsOrder(record.topicCode, "UP")} disabled={record.first == true}>
                                <Icon type="arrow-up" />
                            </Button>
                            <Button type="primary" onClick={() =>
                                that.setSubjectsOrder(record.topicCode, "DOWN")} disabled={record.last == true}>
                                <Icon type="arrow-down" />
                            </Button>
                            <Button type="primary" onClick={() =>
                                that.setSubjectsOrder(record.topicCode, "TOP")} disabled={record.first == true}>
                                <Icon type="to-top" />
                            </Button>
                        </Button.Group>
                    )
                }
            }, {
                title: '其它操作',
                width: 150,
                render(text, record) {
                    return (
                        <Button.Group>
                            <Button type="primary">
                                <Link to={"subjects_edit?topicCode=" + record.topicCode}>
                                    <Icon type="edit" />编辑
                                </Link>
                            </Button>
                            <Button type={record.status === 'NORMAL' ? 'primary' : 'default'} onClick={() => {
                                that.modifyState(record.status === 'NORMAL' ? 'OFF_LINE' : 'PUBLISH_YES', record.topicCode)
                            }}>
                                <Icon type={record.status === "NORMAL" ? 'pause' : 'retweet'} />{record.status === 'NORMAL' ? '下线' : '上线'}
                            </Button>
                        </Button.Group>
                    )
                }
            }
        ].map(item => { item.align = 'center'; return item; })

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        <Table
                            size="small"
                            columns={tableColumns}
                            dataSource={_.get(subjectData, 'topicList', [])}
                            loading={listLoading}
                            rowKey='topicCode'
                            bordered
                            onChange={(pagination, filter, sorter) => {
                                this.props.form.validateFields((err, values) => {
                                    if (!err) {
                                        this.getSubjectList({
                                            ...values,
                                            pageIndex: pagination.current,
                                            pageSize: pagination.pageSize
                                        })
                                    }
                                });
                            }}
                            pagination={{
                                total: _.get(subjectData, 'count'),
                                current: _.get(subjectCache, 'pageIndex'),
                                pageSize: _.get(subjectCache, 'pageSize'),
                                showSizeChanger: true,
                                showQuickJumper: true,
                                current: _.get(subjectCache, 'pageIndex')
                            }}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}
