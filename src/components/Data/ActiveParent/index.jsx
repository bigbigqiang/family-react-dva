import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Button, Icon, Select, Form, Input, Popconfirm } from 'antd';
import styles from './index.less';


const { Item: FormItem } = Form;

@Form.create()
export default class ActiveParent extends PureComponent {

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { visible, onCancel,  parentData } = this.props;

        const columns = [{
            title: '学生姓名',
            dataIndex: 'childrenName',
            key: 'childrenName',
        }, {
            title: '家长手机号',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '家长角色',
            dataIndex: 'role',
            key: 'role',
        }]

        return (
            <Modal
                visible={visible}
                width={640}
                onCancel={onCancel}
                footer={null}
                title="活跃家长"
                destroyOnClose={true}
            >
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={columns}
                            dataSource={parentData}
                        />
                    </Col>
                </Row>

            </Modal >
        )
    }
}