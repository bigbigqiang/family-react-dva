import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Card, Popconfirm, Select, Popover, Table } from 'antd';
import { Link } from "dva/router";
import { dict } from '../../utils/dict';
import { getParameter, cacheManager } from '../../utils/utils';
import styles from './InformationDetail.less';
import moment from 'moment';
const Option = Select.Option
import { TextTypeInfo, ImgTypeInfo, VideoTypeInfo, AudioTypeInfo, PublisherInfo } from './InformationType.jsx';
@connect(state => ({
    sensitiveinfo: state.sensitiveinfo
}))
export default class InformationDetail extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            pageNum: 1,
            pageSize: 10
        }
    }

    componentDidMount() {
        this.getDetailList()
    }
    getDetailList(pageNum, pageSize) {
        this.setState({
            pageNum: pageNum || this.state.pageNum,
            pageSize: pageSize || this.state.pageSize,
        }, () => {
            this.props.dispatch({
                type: 'sensitiveinfo/getDetailList',
                payload: {
                    kindergartenCode: (getParameter('kindergartenCode')),
                    pageNum: pageNum || this.state.pageNum,
                    pageSize: pageSize || this.state.pageSize,
                }
            })
        })

    }
    componentWillReceiveProps() {

    }
    render() {
        const { dispatch } = this.props;
        const { sensitiveinfo } = this.props;
        const { detailInfoList, detailInfoTotal, detailInfoListLoading } = sensitiveinfo;
        const toolbar = (
            <div className={styles.tool_bar}>
                <Link to={`/friendCircle/information?pageNum=${getParameter('pageNum')}&pageSize=${getParameter('pageSize')}&kindergartenName=${getParameter('kindergartenSearchName')}&dateTime=${getParameter('dateTime')}`}><Button type='primary' onClick={() => { }}>返回信息管理</Button></Link>
            </div>
        )
        // console.log(cacheManager.get('uid'));
        const columns = [
            {
                title: '用户',
                dataIndex: 'userName',
                key: 'userName',
                width: 100,
                align: 'center',
                render: (text, record) => (
                    <Popover placement="right" content={
                        <PublisherInfo publisherType={record.publisherType} userName={record.userName} userIcon={record.userIcon} phone={record.phone} kindergartenName={record.kindergartenName} kindergartenClass={record.className} />
                    }>
                        {text}
                    </Popover>
                )
            }, {
                title: '动态内容',
                dataIndex: 'b',
                key: 'b',
                width: 600,
                align: 'center',
                render: (text, record) => {
                    if (record.compositeType.indexOf('IMAGE') != -1) {
                        return <ImgTypeInfo content={record.content} bookName={record.bookName} imgNum={record.imgNum} imageList={record.imageList} />
                    } else if (record.compositeType.indexOf('VIDEO') != -1 || record.compositeType.indexOf('PREVIEW') != -1) {
                        return <VideoTypeInfo content={record.content} bookName={record.bookName} url={record.videoUrl || record.bookVideoPreviewUrl} />
                    } else if (record.compositeType.indexOf('AUDIO') != -1) {
                        return <AudioTypeInfo content={record.content} bookName={record.bookName} url={record.audioUrl} />
                    } else {
                        return <TextTypeInfo content={record.content} bookName={record.bookName} />
                    }
                }
            }, {
                title: '发送时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                width: 100,
                align: 'center',
                render: text => moment(text).format('YYYY-MM-DD')
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
                // render: text => <Link to={'/friendCircle/informationreply'}>{text}</Link>
            }, {
                title: '操作',
                dataIndex: 'f',
                key: 'f',
                width: 100,
                align: 'center',
                render: (text, record) => (
                    <Popconfirm
                        placement="top"
                        title={'确定要删除此条信息吗?'}
                        onConfirm={() => {
                            dispatch({
                                type: 'sensitiveinfo/deleteInfo',
                                payload: {
                                    dynamicId: record.id,
                                    uid: cacheManager.get('uid'),
                                    kindergartenCode: (getParameter('kindergartenCode')),
                                    pageNum: this.state.pageNum,
                                    pageSize: this.state.pageSize,
                                }
                            })
                        }}
                        okText="确定"
                        cancelText="取消">
                        <Button type='primary'><Icon type="delete" />删除</Button>
                    </Popconfirm>
                )
            },
        ]
        return (
            <div className={styles.informationDetail}>
                {toolbar}
                {getParameter('kindergartenName') && <h3>{decodeURI(getParameter('kindergartenName'))}</h3>}
                <Table
                    columns={columns}
                    dataSource={detailInfoList}
                    loading={detailInfoListLoading}
                    scroll={{ y: 540 }}
                    bordered
                    rowKey={'id'}
                    pagination={{
                        total: detailInfoTotal,
                        showSizeChanger: true,
                        current: this.state.pageNum,
                        pageSize: this.state.pageSize,
                        onChange: (pageNum, pageSize) => {
                            this.getDetailList(pageNum, pageSize);
                        },
                        onShowSizeChange: (pageNum, pageSize) => {
                            this.getDetailList(pageNum, pageSize);
                        }
                    }}
                />
            </div>
        )
    }
}
