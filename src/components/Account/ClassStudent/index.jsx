import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Button, Icon, Select, Form, Input, Popconfirm } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
import styles from './index.less';
import { RegSet } from '../../../utils/reg.js';

const { Option } = Select;
const { Item: FormItem } = Form;

@Form.create()
export default class ClassStudent extends PureComponent {

    getAll(callback) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            callback(values);
        });
    }

    state = {
        showEditor: false,
        nowStudent: {}
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { visible, loading, onCancel, onAdd, onDel, studentData, targetClass } = this.props;

        const columns = [{
            title: '学生姓名',
            dataIndex: 'childrenName',
            key: 'childrenName'
        }, {
            title: '家长手机',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '家长角色',
            dataIndex: 'role',
            key: 'role',
        }, {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (text, record) => {
                let result = new Date(record.updateTime * 1);
                return (
                    record.updateTime ? <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span> : '无数据'
                )
            },
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return (
                    <div>
                        <a className={styles.adds} onClick={() => {
                            this.setState({
                                showEditor: true,
                                nowStudent: record
                            })
                        }}>编辑</a>
                        <Popconfirm title="是否确定要删除该学生?" onConfirm={() => {
                            onDel({ classCode: targetClass.classCode, uid: record.uid })
                        }} okText="是" cancelText="否">
                            <a className={styles.adds} >删除</a>
                        </Popconfirm>
                    </div>
                )
            }
        }]

        const addModal = (
            <Modal
                visible={this.state.showEditor}
                destroyOnClose={true}
                onCancel={() => {
                    this.setState({
                        showEditor: false,
                    })
                }}
                onOk={() => {
                    this.getAll((values) => {
                        let config = {
                            ...values,
                            classCode: targetClass.classCode,
                        };

                        if (this.state.nowStudent.uid) {
                            config['uid'] = this.state.nowStudent.uid
                        }
                        onAdd(config)
                    })
                    this.setState({
                        showEditor: false
                    })
                }}
                title="添加学生"
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col>
                            <FormItem label="学生姓名">
                                {getFieldDecorator('childName', {
                                    initialValue: _.get(this.state.nowStudent, 'childrenName', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入学生姓名'
                                    }]
                                })(
                                    <Input size={'default'}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="家长手机号">
                                {getFieldDecorator('customerName', {
                                    initialValue: _.get(this.state.nowStudent, 'phone', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入家长手机号码'
                                    }, {
                                        required: true,
                                        pattern: RegSet.mobilePhone,
                                        message: '请输入正确的电话号码'
                                    }]
                                })(
                                    <Input size={'default'} maxLength={11} disabled={_.has(this.state.nowStudent, 'phone')} ></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="家长角色">
                                {getFieldDecorator('roleName', {
                                    initialValue: _.get(this.state.nowStudent, 'role', '妈妈'),
                                })(
                                    <Select style={{ width: 60 }}>
                                        <Option value="妈妈">妈妈</Option>
                                        <Option value="爸爸">爸爸</Option>
                                        <Option value="爷爷">爷爷</Option>
                                        <Option value="奶奶">奶奶</Option>
                                        <Option value="外公">外公</Option>
                                        <Option value="外婆">外婆</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
        return (
            <Modal
                visible={visible}
                width={640}
                confirmLoading={loading}
                onCancel={onCancel}
                footer={null}
                title="学生列表"
                destroyOnClose={true}
            >
                <Row>
                    <Col>
                        <Button type="primary"
                            onClick={() => {
                                this.setState({
                                    showEditor: true,
                                    nowStudent: {}
                                })
                            }}
                        ><Icon type="plus" />添加学生</Button>
                    </Col>
                </Row>
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
                {addModal}
            </Modal >
        )
    }
}
