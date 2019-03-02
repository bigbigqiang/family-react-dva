import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Button, Icon, Select, Form, Input, Popconfirm } from 'antd';
import styles from './index.less';


const { Item: FormItem } = Form;

@Form.create()
export default class SendTeacher extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible, onCancel,  sendTeacherData } = this.props;

        const columns = [{
            title: '教师姓名',
            dataIndex: 'teacherName',
            key: 'teacherName',
        }, {
            title: '发作业班级',
            dataIndex: 'className',
            key: 'className',
        }, {
            title: '发作业次数',
            dataIndex: 'sendCount',
            key: 'sendCount',
        }]

        return (
            <Modal
                visible={visible}
                width={640}
                onCancel={onCancel}
                footer={null}
                title="发作业教师"
                destroyOnClose={true}
            >
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={columns}
                            dataSource={sendTeacherData}
                        />
                    </Col>
                </Row>

            </Modal >
        )
    }
}