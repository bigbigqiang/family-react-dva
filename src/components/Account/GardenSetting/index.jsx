import React, { PureComponent } from 'react';
import { Modal, Button, Row, Col, Input, Radio } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import moment from 'moment';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@connect(state => ({
    garden: state.garden
}))
export default class GardenSetting extends PureComponent {
    render() {
        const { visible, onCancel } = this.props;
        const { settingInfo } = this.props;
        const handleOk = () => {
            if (settingInfo.kindergartenName) {
                this.props.dispatch({
                    type: "garden/updateSetting",
                    payload: {
                        kindergartenCode: settingInfo.kindergartenCode,
                        saleType: this.refs.saleType.state.value,
                        scheduleStatus: this.refs.scheduleStatus.state.value
                    }
                })
            }
            onCancel();
        }
        return (
            <Modal
                width={'640px'}
                visible={visible && settingInfo.kindergartenName!=null}
                destroyOnClose={true}
                footer={[
                    <Button key="back" onClick={onCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>保存</Button>
                ]}
                onCancel={onCancel}
            >
                <Row>
                    <Col span={12}>
                        园所名称:{settingInfo.kindergartenName || '数据异常'}
                    </Col>
                    <Col span={12}>
                        园所联系人:{settingInfo.contacter || '无'}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        联系人电话:{settingInfo.telephone || '无'}
                    </Col>
                    <Col span={12}>
                        园所地址:{settingInfo.kindergartenAddress || '无'}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        所属合伙人:{settingInfo.partnerName || '无'}
                    </Col>
                    <Col span={12}>
                        园所性质:{settingInfo.nature == 'public' ? '公立' : '私立'}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        创建时间:{moment(new Date(settingInfo.createTime * 1)).format('YYYY-MM-DD HH:mm:ss')}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        销售方式:
                        <RadioGroup ref='saleType'>
                            <RadioButton value='online' checked={settingInfo.saleType == 'online'}>线上支付</RadioButton>
                            <RadioButton value='offline' checked={settingInfo.saleType == 'offline'}>线下实体卡兑换</RadioButton>
                        </RadioGroup>
                    </Col>
                    <Col span={12}>
                        课程状态:
                        <RadioGroup ref='scheduleStatus'>
                            <RadioButton value='show' checked={settingInfo.scheduleStatus == 'show'}>显示</RadioButton>
                            <RadioButton value='hidden' checked={settingInfo.scheduleStatus == 'hidden'}>隐藏</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
            </Modal>
        )
    }
}