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
        let { id, kindergartenCode } = getParameter();
        this.props.dispatch({
            type: 'approval/auditKindergartenShareRatioApply',
            payload: {
                id,
                kindergartenCode,
                checkUid: cacheManager.get('uid'),
                auditStatus,
            }
        })
    }

    componentDidMount() {
        let { id, kindergartenCode } = getParameter();
        this.props.dispatch({
            type: 'approval/getKindergartenShareRatioApplyDetails',
            payload: {
                id,
                kindergartenCode
            }
        })
    }

    render() {

        const { approval: { gartenApplyDetail } } = this.props;
        console.log(gartenApplyDetail)

        const actions = _.get(gartenApplyDetail, 'auditStatus') == "TO_AUDIT" ? [
            <Button type="primary" onClick={() => {
                this.audit('NO_PASS')
            }}>不通过</Button>,
            <Button type="primary" onClick={() => {
                this.audit('PASS')
            }}>通过</Button>,
        ] : [
                < Link to="/approval/garden_divide" >
                    <Button><Icon type="left" />返回</Button>
                </Link >
            ]

        return (
            <Spin spinning={false}>
                <Row>
                    <Link to="/approval/garden_divide">
                        <Button><Icon type="left" />返回分成比例审批列表</Button>
                    </Link>
                </Row>
                <Card
                    title={`调整园所分成比例为${_.get(gartenApplyDetail, 'toRatio', '')}%`}
                    style={{ width: 720, margin: '12px auto' }}
                    actions={actions}
                >
                    <Row>
                        <Col span={12}>合伙人：{_.get(gartenApplyDetail, 'partnerName', '')}</Col>
                        <Col span={12}>合伙人手机号：{_.get(gartenApplyDetail, 'partnerPhone', '')}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>请求操作：{`调整园所分成比例为${_.get(gartenApplyDetail, 'toRatio', '')}%`}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>申请人：{_.get(gartenApplyDetail, 'applyUser', '')}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>申请时间：{moment(_.get(gartenApplyDetail, 'applyTime', '')).format('YYYY-MM-DD HH:mm:ss')}</Col>
                    </Row>
                    <div style={{ display: _.get(gartenApplyDetail, 'checkTime') === null ? 'none' : 'block' }} >
                        <Row>
                            <Col span={12}>审批结果：{dict(_.get(gartenApplyDetail, 'auditStatus', ''), {
                                type: 'badge',
                                prefix: 'APPROVAL'
                            })}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>审批账号：{_.get(gartenApplyDetail, 'checkUser', '')}</Col>
                            <Col span={12}>审批时间：{moment(_.get(gartenApplyDetail, 'checkTime', '')).format('YYYY-MM-DD HH:mm:ss')}</Col>
                        </Row>
                    </div>
                </Card>
            </Spin>
        )
    }
}
