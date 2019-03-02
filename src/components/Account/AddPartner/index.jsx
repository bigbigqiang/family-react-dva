import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Radio, Cascader, Row, Col, DatePicker, Select } from 'antd';
import { provinceData } from '../../../assets/antd_province';
import { RegSet } from '../../../utils/reg.js';
import moment from 'moment';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;

@Form.create()
export default class AddPartner extends Component {

    render() {
        const { visible, init, nowUid, cityManagerList } = this.props;
        const { getFieldDecorator } = this.props.form;
        console.log(init)
        const itemsize = 'default'

        return (
            <Modal
                visible={visible}
                width='960px'
                title="添加合伙人"
                okText={nowUid ? "确认编辑" : "确认添加"}
                cancelText={nowUid ? "取消编辑" : "取消添加"}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={this.props.onCancel}
                onOk={() => { this.props.onOk(this.props.nowUid) }}
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col span={8}>
                            <FormItem label="合伙人类型">
                                {/*通过getFieldDecorator双向绑定的数据，defaultValue已经不能用，
                            需要再getFieldDecorator中指明initialValue */}
                                {getFieldDecorator('partnerType', {
                                    initialValue: _.get(init, 'partnerType', ''),
                                    rules: [{ required: true, message: '请选择合伙人类型!' }],
                                })(
                                    <RadioGroup size={itemsize}>
                                        <RadioButton value="AGENT" checked={_.get(init, 'partnerType', '') == 'AGENT'} defaultChecked={_.get(init, 'partnerType', '') == 'AGENT'}>代理商</RadioButton>
                                        <RadioButton value="EDU" checked={_.get(init, 'partnerType', '') == 'EDU'} defaultChecked={_.get(init, 'partnerType', '') == 'EDU'}>教育机构</RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={16}>
                            <FormItem label="合同期限">
                                {getFieldDecorator('cantractTime', {
                                    // TODO: 需要在model发出之前，整理数据
                                    initialValue: [moment(_.get(init, 'contractBeginTime', new Date().getTime())), moment(_.get(init, 'contractEndTime', new Date().getTime()))],
                                    rules: [{
                                        required: true,
                                        message: '请输入合同期限'
                                    }]
                                })(
                                    <RangePicker
                                        size={itemsize}
                                        placeholder={['合同开始时间', '合同终止时间']}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={8}>
                            <FormItem label="签约方">
                                {getFieldDecorator('partnerName', {
                                    initialValue: _.get(init, 'partnerName', ''),
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
                        <Col span={8}>
                            <FormItem label="所在地区">
                                {getFieldDecorator('geoLocation', {
                                    // TODO: 需要在model发出之前，整理数据  _.get(init, 'address', '')  _.get(init, 'city', '')
                                    initialValue: [_.get(init, 'province', ''), _.get(init, 'city', '')],
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        message: '请输入所在省市'
                                    }]
                                })(
                                    <Cascader size={itemsize} placeholder="请选择省市" options={provinceData} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="对应城市经理">
                                {getFieldDecorator('cityManagerUid', {
                                    initialValue: _.get(init, 'cityManagerUid', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        message: '请选择对应城市经理'
                                    }]
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value=''></Option>
                                        {cityManagerList ? cityManagerList.map((item, i) => <Option key={i} value={item.uid}>{item.cityManagerName}</Option>) : null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label="联系人">
                                {getFieldDecorator('contacts', {
                                    initialValue: _.get(init, 'contacts', ''),
                                    rules: [{
                                        required: true,
                                        max: 60,
                                        message: '请输入联系人称呼'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem label="联系地址">
                                {getFieldDecorator('address', {
                                    initialValue: _.get(init, 'address', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        max: 160,
                                        message: '请输入联系地址'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>


                    </Row>
                    <Row>
                        <Col span={8}>
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
                                    <Input size={itemsize} disabled={init.phone ? true : false}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="电子邮箱">
                                {getFieldDecorator('email', {
                                    initialValue: _.get(init, 'email', ''),
                                    validateTrigger: 'onChange',
                                    rules: [{
                                        required: true,
                                        type: 'email',
                                        pattern: RegSet.email,
                                        message: '请输入正确的电子邮箱'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label="银行卡">
                                {getFieldDecorator('bankCard', {
                                    initialValue: _.get(init, 'bankCard', ''),
                                    rules: [{
                                        required: true,
                                        pattern: /^[0-9]{0,25}$/,
                                        message: '请输入正确的银行卡号'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="开户姓名">
                                {getFieldDecorator('accountName', {
                                    initialValue: _.get(init, 'accountName', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入开户姓名'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="开户行">
                                {getFieldDecorator('bankName', {
                                    initialValue: _.get(init, 'bankName', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入开户行'
                                    }]
                                })(
                                    <Input size={itemsize}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label="园所数量">
                                {getFieldDecorator('maxKindergartenNum', {
                                    initialValue: _.get(init, 'maxKindergartenNum', 25),
                                    rules: [{
                                        required: true,
                                        type: 'number',
                                        message: '请输入园所数量'
                                    }]
                                })(
                                    <InputNumber size={itemsize} min={0}></InputNumber>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="公司分成比例">
                                {getFieldDecorator('corpShareRatio', {
                                    initialValue: _.get(init, 'corpShareRatio', 30),
                                    rules: [{
                                        required: true,
                                        type: 'number',
                                        message: '请输入公司分成比例'
                                    }]
                                })(
                                    <InputNumber disabled={_.has(init, 'uid')} size={itemsize} min={0}></InputNumber>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="园所默认分成比例">
                                {getFieldDecorator('kgShareRatio', {
                                    initialValue: _.get(init, 'kgShareRatio', 40),
                                    rules: [{
                                        required: true,
                                        type: 'number',
                                        message: '请输入园所分成比例'
                                    }]
                                })(
                                    <InputNumber size={itemsize} min={0}></InputNumber>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
