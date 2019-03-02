import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col } from 'antd';
import lodash from 'lodash';
import moment from 'moment';

export default class UpgradeHistory extends PureComponent {

    render() {

        const columns = [{
            title: '升入班级',
            dataIndex: 'afterClassName',
            key: 'afterClassName',
            render: (text) => {
                return text === 'GRADUATE' ? '已毕业' : text
            }
        }, {
            title: '历史班级',
            dataIndex: 'beforeClassName',
            key: 'beforeClassName',
        }, {
            title: '升班时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => {
                let result = new Date(record.createTime * 1);
                return (
                    record.createTime ? <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span> : '无数据'
                )
            },
        }]

        let { visible, onOk, historyData } = this.props;
        return (
            <Modal
                visible={visible}
                onOk={onOk}
                onCancel={onOk}
                title="查看升年级历史"
                destroyOnClose={true}
            >
                <Table
                    // bordered
                    size="small"
                    columns={columns}
                    dataSource={historyData}
                />
            </Modal>
        )
    }
}