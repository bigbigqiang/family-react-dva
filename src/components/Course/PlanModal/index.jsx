
import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Tabs, message } from 'antd';
import styles from './index.less';
import lodash from 'lodash'
const { TextArea } = Input;
const { TabPane } = Tabs;
const FormItem = Form.Item;
@Form.create()
export default class PlanModal extends Component {

    render() {

        const teach_form = this.props.form;
        const { getFieldDecorator, getFieldValue, resetFields } = teach_form;
        const { initData } = this.props;

        const handleOk = (book) => {
            // console.log(book)
            teach_form.validateFields((err, values) => {
                if (err) {
                    console.warn('Received Errors: ', err);
                    for (let errorKey in err) {
                        // message.error(errorItem.errors[0].message)
                        message.error(_.get(err[errorKey], 'errors.0.message'))
                    }
                    return;
                }
                this.props.handlePlanEdit({
                    week: this.props.week,
                    data: values,
                    set_plan_now: book
                })
            });
        }

        const textAreaProps = {
            autosize: {
                minRows: 6,
            }
        }

        return (
            this.props.visible && <Modal
                width='960px'
                title={'编辑教案'}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                onOk={() => {
                    handleOk(this.props.set_plan_now)
                }}
                className={styles.edit_plan}
            >
                <Form>

                    <Tabs
                        defaultActiveKey="1"
                        type={'card'}
                        onChange={this.handleTabChange}
                    >
                        <TabPane tab="教学目标" key="1">
                            <FormItem>
                                {getFieldDecorator('teach_aim', {
                                    initialValue: _.get(this.props.initData, 'teach_aim'),
                                    rules: [{ required: true, message: '教学目标不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area} />
                                    )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="教学准备" key="2">
                            <FormItem>
                                {getFieldDecorator('teach_prepare', {
                                    initialValue: _.get(this.props.initData, 'teach_prepare'),
                                    rules: [{ required: true, message: '教学准备不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area}></TextArea>
                                    )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="教学流程" key="3">
                            <FormItem>
                                {getFieldDecorator('teach_flow', {
                                    initialValue: _.get(this.props.initData, 'teach_flow'),
                                    rules: [{ required: true, message: '教学流程不能为空!' }],
                                })(
                                    <TextArea {...textAreaProps} className={styles.edit_area}></TextArea>
                                    )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="活动延伸" key="4">
                            <FormItem>
                                {getFieldDecorator('teach_extend', {
                                    initialValue: _.get(this.props.initData, 'teach_extend'),
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