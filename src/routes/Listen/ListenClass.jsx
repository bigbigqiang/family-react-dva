/**
 * 主要改动参考ListenIndex 首页前面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import styles from './ListenClass.less';
import moment from 'moment';
import SetListenClass from '../../components/SetListenClass';
import { dict } from '../../utils/dict'

@connect(state => ({
    listenclass: state.listenclass
}))
export default class ListenClass extends Component {
    state = {

    }
    //获取分类详情
    getSortDetail = (sortCode) => {
        this.props.dispatch({
            type: 'listenclass/getSortDetail',
            payload: {
                sortCode: sortCode
            }
        })
    }
    //初始化获取分类列表
    componentDidMount() {
        this.props.dispatch({
            type: 'listenclass/fetch'
        })
    }
    /**
     * 上传图片相关
     */
    render() {
        const { listenclass: { listenList } } = this.props;
        const columns = [
            {
                title: '分类名称',
                dataIndex: 'sortTitle',
            },
            {
                title: '目标类型',
                dataIndex: 'targetType',
                render: (text) => {
                    return dict('APPCLASS_' + text)
                }
            },
            {
                title: '目标链接',
                className: styles.targetPage,
                dataIndex: 'targetPage',
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                },
            },
            {
                title: '操作',
                width: 45,
                render: (text, record) => {
                    return (
                        <Button type="primary">
                            <a onClick={() => this.getSortDetail(record.sortCode)}>编辑</a>
                        </Button>
                    )
                }
            }
        ].map(item => { item.align = 'center'; return item; })


        return (
            <div>
                <Table
                    rowKey='sortCode'
                    columns={columns}
                    bordered
                    size="small"
                    dataSource={listenList}
                    pagination={false}
                ></Table>
                <SetListenClass></SetListenClass>
            </div>
        );
    }
}
