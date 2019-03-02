import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './AppClass.less';
import moment from 'moment';
import SetAppClass from '../../components/SetAppClass';
import { dict } from '../../utils/dict.js'

@connect(state => ({
    appclass: state.appclass
}))
export default class AppClass extends Component {
    state = {

    }

    getSortDetail = (sortCode) => {
        this.props.dispatch({
            type: 'appclass/getSortDetail',
            payload: {
                sortCode: sortCode
            }
        })
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'appclass/fetch'
        })
    }
    /**
     * 上传图片相关
     */
    render() {
        const { appclass: { classList } } = this.props;
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
                dataIndex: 'targetPageDesc',
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
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={() => this.getSortDetail(record.sortCode)}>编辑</a>
                        </div>
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
                    dataSource={classList}
                    pagination={false}
                ></Table>
                <SetAppClass></SetAppClass>
            </div>
        );
    }
}