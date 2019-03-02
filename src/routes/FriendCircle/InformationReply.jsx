import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Row, Col, Select, DatePicker, Table } from 'antd';
import { Link } from "dva/router";
import styles from './InformationReply.less'
import { dict } from '../../utils/dict';
import moment from 'moment';
const Option = Select.Option

@connect(state => ({
    sensitiveinfo: state.sensitiveinfo
}))
export default class InformationDetail extends Component {

    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { dispatch } = this.props;
        const { sensitiveinfo } = this.props;
        const { } = sensitiveinfo;
        const toolbar = (
            <div className={styles.tool_bar}>
                <Button type='primary' onClick={() => { window.history.back() }}>返回where</Button>
            </div>
        )
        const columns = [
            {
                title: '用户',
                dataIndex: 'a',
                key: 'a',
                width: 100,
                align: 'center',
            }, {
                title: '动态内容',
                dataIndex: 'b',
                key: 'b',
                width: 400,
                align: 'center',
            }, {
                title: '发送时间',
                dataIndex: 'c',
                key: 'c',
                width: 100,
                align: 'center',
            }, {
                title: '操作',
                dataIndex: 'f',
                key: 'f',
                width: 100,
                align: 'center',
                render: text => <Button type='primary'><Icon type="delete" />删除</Button>
            },
        ]
        return (
            <div className={styles.informationReply}>
                {toolbar}
                <Table columns={columns} dataSource={[{ e: 123 }, { e: 345 }]} />
            </div>
        )
    }
}
