import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Input, Select, Popconfirm, Modal, Badge } from 'antd';
import { connect } from 'dva';
import styles from './CourseData.less';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    data: state.data
}))
export default class CourseData extends PureComponent {

    state = {
        pageIndex: 1,
        pageSize: 10,
        searchText: '',
        state: '',
        loading: false,
        kindergartenCode: '',
        modal: {
            modalVisible: false,
            pageIndex: 1,
            pageSize: 10
        }
    }
    getDataList = () => {
        this.props.dispatch({
            type: 'data/getCourseData',
            payload: {
                kindergartenName: this.state.searchText,
                scheduleStatus: this.state.state,
                pageIndex: this.state.pageIndex,
                pageSize: this.state.pageSize
            }
        })
    }
    getInterestList = () => {
        this.props.dispatch({
            type: 'data/getInterestList',
            payload: {
                kindergartenCode: this.state.kindergartenCode,
                pageIndex: this.state.modal.pageIndex,
                pageSize: this.state.modal.pageSize
            }
        }, this.setState({
            modal: {
                ...this.state.modal,
                modalVisible: true
            }
        }))

    }
    exportCourseData = (kindergartenCode) => {
        this.props.dispatch({
            type: 'data/exportCourseData',
            payload: {
                kindergartenName: this.state.searchText,
                scheduleStatus: this.state.state
            }
        })
    }
    componentDidMount() {
        this.getDataList();
    }

    render() {
        const { loading, modal } = this.state;
        const { data: {
            courseData,
            courseDataTotal,
            interestData,
            interestDataTotal,
            downloadUrl
        } } = this.props;
        const columns = [
            {
                title: '幼儿园名称',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName'
            }, {
                title: '课程状态',
                dataIndex: 'scheduleStatus',
                key: 'scheduleStatus',
                width: 75,
                render: (text) => {
                    return <Badge status={text == '已启用' ? 'success' : 'error'} text={text} />
                }
            }, {
                title: '30天内收到的兴趣',
                dataIndex: 'thirtyDayInterestCount',
                key: 'thirtyDayInterestCount'
            }, {
                title: '感兴趣数',
                dataIndex: 'totalInterestCount',
                key: 'totalInterestCount',
                render: (text, record) => {
                    return (
                        <Button onClick={() => {
                            this.setState({
                                kindergartenCode: record.kindergartenCode
                            }, () => this.getInterestList())
                        }
                        } type="primary">{record.totalInterestCount > 0 ? record.totalInterestCount : '0'}</Button>
                    )
                }

            }
        ].map(item => { item.align = 'center'; return item; })
        const columns2 = [
            {
                title: '昵称',
                dataIndex: 'nickName',
                key: 'nickName'
            },
            {
                title: '帐号',
                dataIndex: 'phone',
                key: 'phone',
                width: 105,
            },
            {
                title: '所在班级',
                dataIndex: 'className',
                key: 'className'
            },
            {
                title: '累计点击次数',
                dataIndex: 'clickNum',
                key: 'clickNum'
            },
            {
                title: '最近一次时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            }
        ].map(item => { item.align = 'center'; return item; })
        const toolbar = (
            <div>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={12}>
                        <Search
                            placeholder="搜索"
                            onSearch={(value) => {
                                this.setState({
                                    searchText: value,
                                    pageIndex: 1
                                }, () => this.getDataList());
                            }}
                            enterButton
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            defaultValue=""
                            onChange={(value) => {
                                this.setState({
                                    state: value
                                });
                            }}>
                            <Option value="">全部</Option>
                            <Option value="hidden">未启用</Option>
                            <Option value="show">已启用</Option>
                        </Select>
                    </Col>
                    <Col className={styles.rightButton}>
                        <Popconfirm placement="bottomRight" title="是否下载导出数据?" onConfirm={() => {
                            window.open(downloadUrl);
                        }} okText="确认" cancelText="取消">
                            <Button type="primary" onClick={() => {
                                this.exportCourseData();
                            }}>
                                <Icon type="download" />数据导出
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
        )

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        <Table
                            bordered
                            rowKey="kindergartenCode"
                            size="small"
                            columns={columns}
                            loading={loading}
                            dataSource={courseData}
                            // dataSource={partnerData}
                            pagination={{
                                total: courseDataTotal,
                                size: "small",
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onChange: (page, pageSize) => {
                                    this.setState({
                                        pageIndex: page,
                                        pageSize: pageSize
                                    }, () => this.getDataList())
                                },
                                onShowSizeChange: (page, pageSize) => {
                                    this.setState({
                                        pageIndex: page,
                                        pageSize: pageSize
                                    }, () => this.getDataList())
                                }
                            }}
                        ></Table>
                    </Col>
                </Row>
                <Modal
                    width={700}
                    visible={modal.modalVisible}
                    onCancel={() => {
                        this.setState({ modal: { ...modal, modalVisible: false } })
                    }}
                    footer={[
                        <Button type="primary" onClick={() => {
                            this.setState({ modal: { ...modal, modalVisible: false } })
                        }}>确认</Button>
                    ]}>
                    <Table
                        bordered
                        size="small"
                        rowKey='id'
                        dataSource={interestData}
                        columns={columns2}
                        pagination={{
                            defaultPageSize: modal.pageSize,
                            total: interestDataTotal,
                            size: "small",
                            showSizeChanger: true,
                            showQuickJumper: true,
                            onChange: (page, pageSize) => {
                                this.setState({
                                    modal: {
                                        ...modal,
                                        pageIndex: page,
                                        pageSize: pageSize
                                    }
                                }, () => this.getInterestList())
                            },
                            onShowSizeChange: (page, pageSize) => {
                                this.setState({
                                    modal: {
                                        ...modal,
                                        pageIndex: page,
                                        pageSize: pageSize
                                    }
                                }, () => this.getInterestList())
                            }
                        }}>
                    </Table>
                </Modal>
            </div>
        )
    }
}
