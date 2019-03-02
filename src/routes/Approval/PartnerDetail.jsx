import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Card, Button, Icon, Row, Col } from 'antd';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import moment from 'moment';
@connect(state => ({
    approval: state.approval
}))
export default class GardenDetail extends PureComponent {

    audit(auditStatus) {
        let { id, partnerUid } = getParameter();
        this.props.dispatch({
            type: 'approval/auditPartnerShareRatioApply',
            payload: {
                id,
                partnerUid,
                checkUid: cacheManager.get('uid'),
                auditStatus,
            }
        })
    }

    componentDidMount() {
        let { id, partnerUid } = getParameter();
        this.props.dispatch({
            type: 'approval/getPartnerShareRatioApplyDetails',
            payload: {
                id,
                partnerUid
            }
        })
    }

    render() {

        const { approval: { partnerApplyDetail } } = this.props;
        console.log(partnerApplyDetail)

        const actions = _.get(partnerApplyDetail, 'auditStatus') == "TO_AUDIT" ? [
            <Button type="primary" onClick={() => {
                this.audit('NO_PASS')
            }}>不通过</Button>,
            <Button type="primary" onClick={() => {
                this.audit('PASS')
            }}>通过</Button>,
        ] : [
                < Link to="/approval/partner_divide" >
                    <Button><Icon type="left" />返回</Button>
                </Link >
            ]

        return (
            <Spin spinning={false}>
                <Row>
                    <Link to="/approval/partner_divide">
                        <Button><Icon type="left" />返回分成比例审批列表</Button>
                    </Link>
                </Row>
                <Card
                    title={`调整公司分成比例为${_.get(partnerApplyDetail, 'toRatio', '')}%`}
                    style={{ width: 720, margin: '12px auto' }}
                    actions={actions}
                >
                    <Row>
                        <Col span={12}>合伙人：{_.get(partnerApplyDetail, 'partnerName', '')}</Col>
                        <Col span={12}>合伙人手机号：{_.get(partnerApplyDetail, 'partnerPhone', '')}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>请求操作：{_.get(partnerApplyDetail, 'toRatio', '')}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>申请人：{_.get(partnerApplyDetail, 'applyUser', '')}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>申请时间：{moment(_.get(partnerApplyDetail, 'applyTime', '')).format('YYYY-MM-DD HH:mm:ss')}</Col>
                    </Row>
                    <div style={{ display: _.get(partnerApplyDetail, 'checkTime') === null ? 'none' : 'block' }} >
                        <Row>
                            <Col span={12}>审批结果：{dict(_.get(partnerApplyDetail, 'auditStatus', ''), {
                                type: 'badge',
                                prefix: 'APPROVAL'
                            })}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>审批账号：{_.get(partnerApplyDetail, 'checkUser', '')}</Col>
                            <Col span={12}>审批时间：{moment(_.get(partnerApplyDetail, 'checkTime', '')).format('YYYY-MM-DD HH:mm:ss')}</Col>
                        </Row>
                    </div>
                </Card>
            </Spin>
        )
    }
}
