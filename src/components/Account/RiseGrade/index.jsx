import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Modal, Select, Popconfirm, Checkbox, message } from 'antd';
import lodash from 'lodash';
import moment from 'moment';

const { Option } = Select;
const { Item: FormItem } = Form;

@Form.create()
export default class riseGrade extends PureComponent {

    state = {
        showClassName: false,
        showAlert: false
    }

    getAll(callback) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            callback(values);
        });
    }

    render() {

        let { visible, loading, onOk, onCancel, classInfo, upperClass } = this.props;

        const { getFieldDecorator, getFieldValue } = this.props.form;

        let opriotns = upperClass.map(item => {
            return <Option key={item.classCode}>{item.className}</Option>
        })
        opriotns.push(<Option key='other'>其它</Option>)

        const notice = <div>
            <div>1、升年级后信息无法修改</div>
            <div>2、大班升年级即毕业，无需选择目标班级</div>
        </div>;

        return (
            <Modal
                visible={visible}
                confirmLoading={loading}
                onOk={() => {
                    this.getAll((values) => {
                        console.log(values)
                        if (values.notice) {
                            onOk({
                                oldClassCode: classInfo.classCode,
                                className: values.newClassName,
                                newClassCode: values.newClassCode === 'other' ? '' : values.newClassCode,
                            })

                            this.setState({
                                showAlert: false
                            })
                        } else {
                            this.setState({
                                showAlert: true
                            })
                        }

                    })
                }}
                onCancel={() => {
                    onCancel();
                    this.setState({
                        showClassName: false
                    })
                }}
                title="升年级"
                destroyOnClose={true}
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col>
                            <FormItem label="当前班级">
                                {getFieldDecorator('className', {
                                    initialValue: _.get(classInfo, 'className', ''),
                                })(
                                    <Input size={'default'} disabled={true}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="入学年份">
                                {getFieldDecorator('enrolYear', {
                                    initialValue: moment(_.get(classInfo, 'enrolYear', '')).format('YYYY年')
                                })(
                                    <Input size={'default'} disabled={true}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="升入班级">
                                {getFieldDecorator('newClassCode', {
                                    initialValue: '',
                                })(
                                    <Select
                                        style={{ width: '160px' }}
                                        placeholder="请选择目标班级"
                                        onChange={(value) => {
                                            if (value === 'other') {
                                                this.setState({
                                                    showClassName: true
                                                })
                                            } else {
                                                this.setState({
                                                    showClassName: false
                                                })
                                            }
                                        }}
                                    >
                                        {opriotns}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    {this.state.showClassName ? <Row>
                        <Col>
                            <FormItem label="班级名称">
                                {getFieldDecorator('newClassName', {
                                    initialValue: '',
                                    rules: [{
                                        required: true,
                                        message: '请输入班级名'
                                    }]
                                })(
                                    <Input placeholder="请输入班级名"></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row> : ''}
                    <Row>
                        <Col>
                            <FormItem label="修改须知">
                                {getFieldDecorator('notice', {
                                    initialValue: false,
                                    rules: [{
                                        required: true,
                                        // validator: function (rule, value, callback) {
                                        //     if (value !== true) {
                                        //         callback(rule.message);
                                        //         return false;
                                        //     }
                                        //     callback()
                                        // },
                                        message: ''
                                    }]
                                })(
                                    <Checkbox>我已阅读升年级须知</Checkbox>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: '0 0 0 70px', color: '#f00', display: this.state.showAlert ? 'block' : 'none' }}>
                            {notice}
                        </Col>
                    </Row>
                </Form>
            </Modal>


        )
    }
}
