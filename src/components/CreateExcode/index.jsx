/**
 * @description 生成兑换码，作为弹窗使用
 * 1. 填写 备注 数量 类型
 * 2. 发送数据给服务器
 * 3. 开始loading等待（可以关闭弹窗）
 * 4. 收到服务器返回的excel地址
 * 5. 新窗口打开excel地址，触发浏览器下载
 * 6. 清理/重置 model数据，关闭弹窗
 * 7. 结束loading
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;

@Form.create()
export default class CreateExcode extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title='生成兑换码'
                visible={this.props.visible || false}
                onCancel={this.props.onCancel}
                onOk={() => {
                    this.props.form.validateFields((err, values) => {
                        if (!err) {
                            this.props.onOk(values)
                        } else {
                            console.log(err)
                        }
                    })
                }}
                okText={'生成并保存Excel'}
            >
                <Form layout='inline'>
                    <FormItem label="备注">
                        {getFieldDecorator('remark', {
                            initialValue: '',
                            rules: [{ required: false, type: 'string' }],
                        })(
                            <Input></Input>
                        )}
                    </FormItem>
                    <br />
                    <FormItem label="数量">
                        {getFieldDecorator('count', {
                            initialValue: 1000,
                            rules: [{ required: true, message: '请输入兑换码数量', type: 'number' }],
                        })(
                            <InputNumber min={1} max={50000} />
                        )}
                    </FormItem>
                    <br />
                    <FormItem label="类型">
                        {getFieldDecorator('cardType', {
                            initialValue: 'ELLA-VIP-CARD-YEAR',
                        })(
                            <Select>
                                <Option value='ELLA-VIP-CARD-HALF-YEAR'>185天</Option>
                                <Option value='ELLA-VIP-CARD-YEAR'>365天</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}