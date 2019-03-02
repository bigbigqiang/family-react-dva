import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Button, Icon, Select, Form, Input, Popconfirm } from 'antd';
import styles from './index.less';


const { Item: FormItem } = Form;

@Form.create()
export default class ActiveTeacher extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible, onCancel,  acTeacherData } = this.props;

        const columns = [{
            title: '教师姓名',
            dataIndex: 'teacherName',
            key: 'teacherName',
        }, {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '所在班级',
            dataIndex: 'className',
            key: 'className',
        }]

        return (
            <Modal
                visible={visible}
                width={640}
                onCancel={onCancel}
                footer={null}
                title="活跃教师"
                destroyOnClose={true}
            >
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={columns}
                            dataSource={acTeacherData}
                        />
                    </Col>
                </Row>

            </Modal >
        )
    }
}