import React, { PureComponent } from 'react';
import { Modal, Checkbox, Row, Col, Form, Input, Tree } from 'antd';
import lodash from 'lodash';

import styles from './index.less';
const { TreeNode } = Tree;
const { Item: FormItem } = Form;

@Form.create()
export default class AuthoritySelect extends PureComponent {

    state = {
        selected: []
    }
    getAll(callback) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error('错误: ', err);
                return;
            }
            callback(values);
        });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.label} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }
    render() {

        let { visible, loading, onOk, onCancel, roleCode, authorityTree, authorityData } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        let selected = authorityData.menuData;

        return (
            <Modal
                visible={visible}
                confirmLoading={loading}
                onOk={() => {
                    this.getAll((values) => {
                        values['menuCodeList'] = selected;
                        onOk({
                            roleCode,
                            ...values
                        })
                    })
                }}
                onCancel={onCancel}
                title="编辑权限"
                destroyOnClose={true}
            >
                <Form layout='inline' hideRequiredMark={true}>
                    <Row>
                        <Col>
                            <FormItem label="角色名字">
                                {getFieldDecorator('roleName', {
                                    initialValue: _.get(authorityData, 'role.roleName', ''),
                                    rules: [{
                                        required: true,
                                        message: '请输入角色名字'
                                    }]
                                })(
                                    <Input size={'default'}></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="权限详情">
                                <Tree
                                    className={styles.tree}
                                    treeData={authorityTree}
                                    checkable={true}
                                    defaultCheckedKeys={selected || []}
                                    style={{
                                        width: 300,
                                    }}
                                    onCheck={(values) => {
                                        console.log(values)
                                        selected = values;
                                    }}
                                >
                                    {this.renderTreeNodes(authorityTree)}
                                </Tree>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        )
    }
}