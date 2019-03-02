import React, { PureComponent } from 'react';
import { Modal, Checkbox } from 'antd';
import lodash from 'lodash';

const { Group: CheckGroup } = Checkbox;

export default class RoleSelect extends PureComponent {

    render() {

        let { visible, loading, onOk, onCancel, user, roleData } = this.props;


        let opriotns = roleData.map(item => {
            return { label: item.roleName, value: item.roleCode }
        })

        let defaultValue = roleData.filter(item => item.choseType === 'true').map(item => {
            return item.roleCode
        })

        // 不应该放到state，会引起无限加载
        let roleList = defaultValue;

        return (
            <Modal
                visible={visible}
                confirmLoading={loading}
                onOk={() => {
                    onOk(user, roleList)
                }}
                onCancel={onCancel}
                title="编辑权限"
                destroyOnClose={true}
            >
                <CheckGroup rowKey={'id'} options={opriotns} defaultValue={defaultValue} onChange={(value) => {
                    roleList = value
                }} />
            </Modal>
        )
    }
}