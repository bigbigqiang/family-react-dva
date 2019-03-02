import React, { PureComponent } from 'react';
import { Modal, Checkbox, Row, Col, Form, Input, TreeSelect } from 'antd';
import lodash from 'lodash';

const { Group: CheckGroup } = Checkbox;

const { Item: FormItem } = Form;
const { SHOW_CHILD } = TreeSelect;

@Form.create()
export default class TeacherEdit extends PureComponent {

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
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { visible, loading, onOk, onCancel, theTeacher } = this.props;

        const treeData = [{
            label: '小班',
            value: 'G0000000001',
            key: 'G0000000001',
            children: _.get(theTeacher, 'grade1', []).map(item => {
                return {
                    label: item.className,
                    value: item.classCode,
                    key: item.classCode,
                }
            })
        }, {
            label: '中班',
            value: 'G0000000002',
            key: 'G0000000002',
            children: _.get(theTeacher, 'grade2', []).map(item => {
                return {
                    label: item.className,
                    value: item.classCode,
                    key: item.classCode,
                }
            })
        }, {
            label: '大班',
            value: 'G0000000003',
            key: 'G0000000003',
            children: _.get(theTeacher, 'grade3', []).map(item => {
                return {
                    label: item.className,
                    value: item.classCode,
                    key: item.classCode,
                }
            })
        }]

        const classList = _.get(theTeacher, 'teacherInfo.teacherClassList', []) || [];
        const selectValue = classList.map(item => {
            return _.get(item, 'classCode', null)
        })

        return (
            <Modal
                visible={visible}
                confirmLoading={loading}
                onOk={() => {
                    this.getAll((values) => {
                        onOk({
                            uid: theTeacher.teacherInfo.uid,
                            phone: values.phone,
                            teacherName: values.teacherName,
                            classCodeList: values.classCodeList,
                        })
                    })

                }}
                onCancel={onCancel}
                title="添加/编辑教师"
                destroyOnClose={true}
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col>
                            <FormItem label="教师名字">
                                {getFieldDecorator('teacherName', {
                                    initialValue: _.get(theTeacher, 'teacherInfo.teacherName', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入角色名字'
                                    }]
                                })(
                                    <Input size={'default'}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="手机号">
                                {getFieldDecorator('phone', {
                                    initialValue: _.get(theTeacher, 'teacherInfo.phone', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入手机号码'
                                    }, {
                                        len: 11,
                                        message: '手机号码必须为11位'
                                    }]
                                })(
                                    <Input size={'default'} maxLength={11} disabled={_.has(theTeacher, 'teacherInfo.phone')}></Input>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="分配班级">
                                {getFieldDecorator('classCodeList', {
                                    initialValue: selectValue || [],
                                })(
                                    <TreeSelect
                                        treeData={treeData}
                                        treeCheckable={true}
                                        showCheckedStrategy={SHOW_CHILD}
                                        searchPlaceholder={'请为该教师分配班级'}
                                        style={
                                            { width: 300 }
                                        }
                                        onChange={(value) => {
                                            console.log(value)
                                        }}
                                    ></TreeSelect>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        )
    }
}
