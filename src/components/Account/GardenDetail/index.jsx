import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import lodash from 'lodash';
import styles from './index.less';

export default class GardenDetail extends PureComponent {
    render() {

        const { visible, gardenInfo, roleInfo, authorityHandle, info, onCancel } = this.props;

        let defaultValue = roleInfo.filter(item => item.choseType === 'true').map(item => {
            return item.roleName
        })
        return (
            <Modal
                visible={visible}
                destroyOnClose={true}
                footer={null}
                onCancel={onCancel}
            >
                <div className={styles.linkman} >联系人：{_.get(gardenInfo, 'contacter', '')}</div>
                <div className={styles.address} > 地址：{_.get(gardenInfo, 'kindergartenAddress', '')}</div>
                {defaultValue.length === 0 ?
                    <Button
                        type="primary"
                        className={styles.button}
                        onClick={() => {
                            authorityHandle(gardenInfo)
                        }}>开通PC端运营权限</Button> :
                    <div className={styles.hasAuthority}>已开通PC端运营权限：<span>{defaultValue[0]}</span></div>}
                <div className={styles.notice}>
                    开通权限后，园所可使用园长账号登录家园运营平台，进行人员管理或设定自定义课表等操作
                </div>
            </Modal >
        )
    }
}