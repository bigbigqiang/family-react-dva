import React, { Component } from 'react';
import { Input, Icon, Modal, Form, Tabs, Row, Col, message, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { Button } from 'antd';
import { cacheManager } from '../../../utils/utils';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
    lesson: state.lesson
}))
@Form.create()
export default class PlanModal extends Component {
    state = {}
    render() {
        const KinderCode = cacheManager.get('ellahome_CGC');
        const { lesson: { initData }, bookCode } = this.props;
        const { getFieldDecorator } = this.props.form;
        const textAreaProps = {
            autosize: { minRows: 6 }
        }
        const handlePlanSubmit = () => {
            const form = this.props.form;
            form.validateFields((err, values) => {
                if (!err) {
                    this.props.dispatch({
                        type: 'lesson/setPlan',
                        payload: { ...values, bookCode, kindergarten_code: KinderCode }
                    })
                } else {
                    console.log(err);
                }
            });
        }
        const handlePlanRecover = () => {
            console.log('恢复默认教案!');
            this.props.dispatch({
                type: 'lesson/recoverPlan',
                payload: { bookCode, kindergarten_code: KinderCode }
            }, this.props.onCancel())
        }
        return (
            <Modal
                destroyOnClose={true}
                title={'编辑教案'}
                footer={[
                    <Popconfirm key="recover" title="是否确定恢复默认教案?" onConfirm={handlePlanRecover} okText="确认" cancelText="取消">
                        <Button style={KinderCode ? { float: 'left' } : { display: 'none' }} type="primary" size="small">恢复至默认教案</Button>
                    </Popconfirm>,
                    <Button key="back" size="small" onClick={this.props.onCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="small" onClick={handlePlanSubmit}>确定</Button>
                ]}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                onOk={handlePlanSubmit}>
                <Form>
                    <Tabs
                        defaultActiveKey="1"
                        type={'card'}
                    >
                        <TabPane tab="教学目标" key="1">
                            <FormItem>
                                {getFieldDecorator('target', {
                                    initialValue: _.get(initData, 'target'),
                                    rules: [{ required: true, message: '教学目标不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area} />
                                )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="教学准备" key="2">
                            <FormItem>
                                {getFieldDecorator('preparation', {
                                    initialValue: _.get(initData, 'preparation'),
                                    rules: [{ required: true, message: '教学准备不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area}></TextArea>
                                )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="教学流程" key="3">
                            <FormItem>
                                {getFieldDecorator('process', {
                                    initialValue: _.get(initData, 'process'),
                                    rules: [{ required: true, message: '教学流程不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area}></TextArea>
                                )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="活动延伸" key="4">
                            <FormItem>
                                {getFieldDecorator('activityExtension', {
                                    initialValue: _.get(initData, 'activityExtension'),
                                    rules: [{ required: true, message: '活动延伸不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area}></TextArea>
                                )}
                            </FormItem>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>
        )
    }
}
