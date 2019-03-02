import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Row, Col, Select, DatePicker, Table } from 'antd';
import PieChart from './PieChart.jsx';
import { getParameter } from '../../utils/utils';
import { dict } from '../../utils/dict';
import styles from './Information.less';
import moment from 'moment';
import { Link } from "dva/router";
const Option = Select.Option

@connect(state => ({
    sensitiveinfo: state.sensitiveinfo
}))
export default class Information extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            dateTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            // dateTime: '2018-12-19',
            kindergartenName: '',
            pageNum: 1,
            pageSize: 10,
        }
    }

    componentWillMount() {
        //获取列表数据
        this.getDailyInfoList(parseInt(getParameter('pageNum')) || 1, parseInt(getParameter('pageSize')) || 10, getParameter('dateTime') || this.state.dateTime, decodeURI(getParameter('kindergartenName')));
        //获取图表数据
        // this.props.dispatch({
        //     type: 'sensitiveinfo/getDailyChartInfoList',
        //     payload: {
        //         dateTime: this.state.dateTime,
        //     }
        // })
    }
    //获取列表数据
    getDailyInfoList(pageNum, pageSize, dateTime, kindergartenName) {

        if (!kindergartenName) {
            if (kindergartenName != '') {
                kindergartenName = this.state.kindergartenName
            }
        }

        this.setState({
            pageNum: pageNum || this.state.pageNum,
            pageSize: pageSize || this.state.pageSize,
            dateTime: dateTime || this.state.dateTime,
            kindergartenName: kindergartenName
        }, () => {
            this.props.dispatch({
                type: 'sensitiveinfo/getDailyChartInfoList',
                payload: {
                    dateTime: this.state.dateTime,
                }
            });
            this.props.dispatch({
                type: 'sensitiveinfo/getDailyInfoList',
                payload: {
                    dateTime: dateTime || this.state.dateTime,
                    pageNum: pageNum || this.state.pageNum,
                    pageSize: pageSize || this.state.pageSize,
                    kindergartenName: kindergartenName
                }
            });
        })

    }
    render() {
        const { dispatch } = this.props;
        const { sensitiveinfo } = this.props;
        const { kindergartenListData, kindergartenTotal, contentChartData, personChartData, sendTotal, kindergartenListLoading } = sensitiveinfo;
        const toolbar = (
            <div className={styles.tool_bar}>
                <span className={styles.info}>
                    {this.state.dateTime}&nbsp;&nbsp; 共{sendTotal}条信息
                </span>
                <Link to={`/friendCircle/informationdetail?dateTime=${this.state.dateTime}`}><Button className={styles.rightButton} type='primary' onClick={() => { }}>全部历史信息</Button></Link>
            </div >
        )
        const toolbar2 = (
            <div className={styles.tool_bar}>
                <Select defaultValue={'kindergartenName'} style={{ width: 120 }} onChange={() => { }}>
                    <Option value="kindergartenName">幼儿园名称</Option>
                    {/* <Option value="parentName" disabled>所属合伙人</Option> */}
                </Select>
                <Input.Search
                    style={{ width: 400, marginLeft: 20 }}
                    placeholder="请输入搜索内容"
                    value={this.state.kindergartenName}
                    onChange={(e) => { this.setState({ kindergartenName: e.target.value }) }}
                    onSearch={value => {
                        this.getDailyInfoList(1, 10, this.state.dateTime, value)
                    }}
                    enterButton
                />
                <DatePicker
                    className={styles.rightButton}
                    value={moment(this.state.dateTime, 'YYYY-MM-DD')}
                    onChange={(v1, v2) => {
                        this.getDailyInfoList(null, null, v2);
                    }} />
            </div >
        )
        console.log(this.state.pageNum)
        const columns = [
            {
                title: '幼儿园名称',
                dataIndex: 'kindergartenName',
                key: 'kindergartenName',
                width: 100,
                align: 'center',
            }, {
                title: '所属合伙人',
                dataIndex: 'partnerName',
                key: 'partnerName',
                width: 100,
                align: 'center',
            }, {
                title: '信息数量',
                dataIndex: 'sendNum',
                key: 'sendNum',
                width: 100,
                align: 'center',
                render: (text, record) => <Link to={`/friendCircle/informationdetail?pageNum=${this.state.pageNum}&pageSize=${this.state.pageSize}&kindergartenSearchName=${this.state.kindergartenName}&dateTime=${this.state.dateTime}&kindergartenCode=${record.kindergartenCode}&kindergartenName=${record.kindergartenName}`}>{text}</Link>
            }, {
                title: '点赞数',
                dataIndex: 'praiseNum',
                key: 'praiseNum',
                width: 100,
                align: 'center',
            }, {
                title: '评论数',
                dataIndex: 'commentNum',
                key: 'commentNum',
                width: 100,
                align: 'center',
            },
        ]
        return (
            <div className={styles.information}>
                {toolbar}
                <Row>
                    <Col span={13} className={styles.pieChartWrap}>
                        <PieChart data={
                            contentChartData.filter(item => item.count != 0)
                            //     [
                            //     {
                            //         item: "事例2一",
                            //         count: 20
                            //     },
                            //     {
                            //         item: "事例2二",
                            //         count: 31
                            //     },
                            //     {
                            //         item: "事例2三",
                            //         count: 27
                            //     },
                            //     {
                            //         item: "事例2四",
                            //         count: 3
                            //     },
                            //     {
                            //         item: "事例2五",
                            //         count: 19
                            //     }
                            // ]
                        }></PieChart>
                    </Col>
                    <Col span={11} className={styles.pieChartWrap}>
                        <PieChart data={personChartData.filter(item => item.count != 0)}></PieChart>
                    </Col>
                </Row>
                {toolbar2}
                <Table
                    columns={columns}
                    rowKey={'kindergartenCode'}
                    dataSource={kindergartenListData}
                    loading={kindergartenListLoading}
                    bordered
                    scroll={{ y: 550 }}
                    pagination={{
                        total: kindergartenTotal,
                        showSizeChanger: true,
                        current: this.state.pageNum,
                        defaultCurrent: this.state.pageNum,
                        pageSize: this.state.pageSize,
                        scroll: { y: 540 },
                        onChange: (pageNum, pageSize) => {
                            this.getDailyInfoList(pageNum, pageSize);
                        },
                        onShowSizeChange: (pageNum, pageSize) => {
                            this.getDailyInfoList(pageNum, pageSize);
                        }
                    }} />
            </div>
        )
    }
}
