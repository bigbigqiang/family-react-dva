import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Button, Icon, Select, Form, Input, Popconfirm } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const { Item: FormItem } = Form;

@Form.create()
export default class SendTask extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible, onCancel,  studentData } = this.props;

        const columns = [{
            title: '发送作业时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => {
                let result = new Date(record.createTime * 1);
                return (
                    record.createTime ? <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span> : '无数据'
                )
            },
        }, {
            title: '作业书目',
            dataIndex: 'bookName',
            key: 'bookName',
        }, {
            title: '发作业班级',
            dataIndex: 'className',
            key: 'className',
        }, {
            title: '发送作业教师',
            dataIndex: 'teacherName',
            key: 'teacherName',

        }]

        return (
            <Modal
                visible={visible}
                width={640}
                onCancel={onCancel}
                footer={null}
                title="发送作业"
                destroyOnClose={true}
            >
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={columns}
                            dataSource={studentData}
                        />
                    </Col>
                </Row>

            </Modal >
        )
    }
}