import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Select, Button } from 'antd';
import { RegSet } from '../../../utils/reg.js';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class Operator extends Component {

    state = {
        showResetBtn: true
    }

    render() {

        const { visible, init, nowUid, roleList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const itemsize = 'default'

        return (
            <Modal
                visible={visible}
                width='600px'
                title="添加运营人员"
                okText={nowUid ? "确认编辑" : "确认添加"}
                cancelText={nowUid ? "取消编辑" : "取消添加"}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={this.props.onCancel}
                onOk={() => { this.props.onOk(this.props.nowUid) }}
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col span={12}>
                            <FormItem label="姓名">
                                {getFieldDecorator('operatorName', {
                                    initialValue: _.get(init, 'operatorName', ''),
                                    rules: [{
                                        required: true,
                                        max: 160,
                                        message: '请输入签约方信息'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="手机号">
                                {getFieldDecorator('phone', {
                                    initialValue: _.get(init, 'phone', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        pattern: RegSet.mobilePhone,
                                        message: '请输入正确的电话号码'
                                    }]
                                })(
                                    <Input size={itemsize} maxLength={11} disabled={init.phone ? true : false}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="角色">
                                {getFieldDecorator('roleCode', {
                                    initialValue: _.get(init, 'roleCode', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        message: '请选择对应角色'
                                    }]
                                })(
                                    <Select style={{ width: 160 }}>
                                        <Option value=''></Option>
                                        {roleList ? roleList.map((item, i) => <Option key={i} value={item.roleCode}>{item.roleName}</Option>) : null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={15} style={{ lineHeight: '39px' }}>
                            <FormItem label="密码">
                                {(!nowUid || (nowUid && !this.state.showResetBtn)) && getFieldDecorator('password', {
                                    initialValue: _.get(init, 'password', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        pattern: /^[a-zA-Z0-9]{6,12}$/,
                                        message: '密码仅支持6-12位数字或字母'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>

                            {nowUid && <Button type="primary" onClick={() => {
                                this.setState({
                                    showResetBtn: !this.state.showResetBtn
                                })
                            }}>{this.state.showResetBtn ? '重置' : '取消重置'}</Button>}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
