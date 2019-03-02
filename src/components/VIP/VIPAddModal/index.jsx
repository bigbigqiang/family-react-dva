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
import { RegSet } from '../../../utils/reg.js';

const { Item: FormItem } = Form;
const { Option } = Select;

@Form.create()
export default class CreateExcode extends Component {

    state = {
        selectArr: []
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title='添加赠送VIP'
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
                okText={'保存'}
            >
                <Form layout='inline' hideRequiredMark={true} >
                    <FormItem label="备注">
                        {getFieldDecorator('remark', {
                            initialValue: '',
                            rules: [{ required: false, type: 'string' }],
                        })(
                            <Input></Input>
                        )}
                    </FormItem>
                    <br />
                    <FormItem label="赠送天数">
                        {getFieldDecorator('days', {
                            initialValue: null,
                            rules: [{ required: true, message: '最1天，上限185天', type: 'number' }],
                        })(
                            <InputNumber min={1} max={185} style={{ width: 132 }} />
                        )}
                    </FormItem>
                    <br />
                    <FormItem label="赠送账号">
                        {getFieldDecorator('sendMembers', {
                            initialValue: [],
                            rules: [{ required: true, message: '赠送手机号不能为空', }, {
                                type: 'array',
                                validator: (rule, value, callback) => {
                                    // 一旦有内容，就判断格式是否正确
                                    for (let i = 0; i < value.length; i++) {
                                        if (!RegSet.mobilePhone.test(value[i])) {
                                            callback(value[i] + '不是一个正确的手机格式 ');
                                            return false;
                                        }
                                    }
                                    callback()
                                }
                            }]
                        })(
                            <Select
                                mode="tags"
                                placeholder="请输入需要赠送的手机号码"
                                tokenSeparators={[',', '，', ' ']}
                                style={{
                                    width: 132
                                }}
                            // value = {this.state.selectArr}
                            // onChange={(value)=>{
                            //     if(!RegSet.mobilePhone.test(value[value.length-1])){
                            //         value.pop()
                            //         console.log(value)
                            //     }
                            // }}
                            />
                        )}
                    </FormItem>
                    <div>
                        <br />
                        注意：
                        <br />
                        1. 不要使用其他特殊符号
                        <br />
                        2. 复制粘贴的时候，会自动判断手机的基本格式
                        <br />
                        3. 复制粘贴的时候，会自动去重
                    </div>
                </Form>
            </Modal>
        )
    }
}