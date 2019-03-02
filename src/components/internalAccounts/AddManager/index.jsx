import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Select, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
export default class AddRegionalManager extends Component {

    state = {
        showResetBtn: true
    }

    render() {

        const { visible, init, nowUid, type, regionalManagerList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const itemsize = 'default'
        const NAME = type === 'cityManager' ?'cityManagerName':'regionalManagerName'
        const NUMBER = type === 'cityManager' ?'cityManagerNumber':'regionalManagerNumber'
        console.log(init)

        return (
            <Modal
                visible={visible}
                width='600px'
                title={type === 'cityManager' ? '城市经理' : '大区经理'}
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
                                {getFieldDecorator(NAME, {
                                    initialValue: _.get(init, NAME, ''),
                                    rules: [{
                                        required: true,
                                        max: 160,
                                        message: '请输入姓名'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="工号">
                                {getFieldDecorator(NUMBER, {
                                    initialValue: _.get(init, NUMBER, ''),
                                    rules: [{
                                        required: true,
                                        min: 6,
                                        max: 6,
                                        message: '工号仅支持6位数字字母'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="地域">
                                {getFieldDecorator('addressDesc', {
                                    initialValue: _.get(init, 'addressDesc', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        max: 160,
                                        message: '请输入地域'
                                    }]
                                })(
                                    <TextArea style={{ width: 440 }} />
                                )}
                            </FormItem>
                        </Col>


                    </Row>
                    <Row>
                        {type === 'cityManager' && <Col span={10}>
                            <FormItem label="对应大区经理">
                                {getFieldDecorator('regionalManagerUid', {
                                    initialValue: _.get(init, 'regionalManagerUid', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        message: '请选择对应大区经理'
                                    }]
                                })(
                                    <Select style={{ width: 108 }}>
                                        <Option value=''></Option>
                                        {regionalManagerList ? regionalManagerList.map((item, i) => <Option key={i} value={item.uid}>{item.regionalManagerName}</Option>) : null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>}
                        <Col span={14} style={{ lineHeight: '39px' }}>
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
