import { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Col, Row, Button, Icon, Input, Radio, Select, Card, InputNumber } from 'antd';
import { getParameter, cacheManager } from '../../utils/utils';
import ImgPreview from '../../components/ImgPreview';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './GardenVerify.less';

@connect(state => ({
    garden: state.garden
}))
export default class GardenVerify extends PureComponent {

    componentDidMount() {
        const kindergartenCode = getParameter('kindergartenCode') || null;
        this.props.dispatch({
            type: 'garden/getVerifyDetail',
            payload: { kindergartenCode }
        })
    }

    verify(status) {
        this.props.dispatch({
            type: 'garden/verify',
            payload: {
                uid: cacheManager.get('uid'),
                certificationStatus: status,
                kindergartenCode: getParameter('kindergartenCode')
            }
        })
    }

    render() {

        const from = getParameter('from');
        const kindergartenCode = getParameter('kindergartenCode') || null;
        const businessCode = getParameter('businessCode') || null;

        const { verifyInfo } = this.props.garden;

        const cardActions = [
            <Button onClick={() => {
                this.verify('PASS')
            }} type="primary">审核通过</Button>,
            <Button onClick={() => {
                this.verify('NO_PASS')
            }} type="danger">审核不通过</Button>
        ];

        return (
            <div>
                <Row>
                    <Col>
                        <Button>
                            <Link to={`/account/${from === 'garden' ? 'garden' : 'self_regist_garden'}?type=back${businessCode ? '&businessCode=' + businessCode : ''}`}>
                                <Icon type="left" />返回幼儿园列表
                            </Link>
                        </Button>
                    </Col>
                </Row>
                <Card actions={cardActions}>
                    <Card type="inner" title="园所信息" style={{ marginTop: 15 }}>
                        园所名称：{_.get(verifyInfo, 'kindergartenName', '')}
                        <br />
                        手机号码：{_.get(verifyInfo, 'telephone', '')}
                    </Card>
                    <Card type="inner" title="园所照片：" style={{ marginTop: 15 }}>
                        <ImgPreview className={styles.imgShow} src={_.get(verifyInfo, 'kindergartenIMG', '')}></ImgPreview>
                    </Card>
                    <Card type="inner" title="园所简介：" style={{ marginTop: 15 }}>
                        {_.get(verifyInfo, 'introduction', '')}
                    </Card>
                    <Card type="inner" title="办园许可证：" style={{ marginTop: 15 }}>
                        <ImgPreview className={styles.imgShow} src={_.get(verifyInfo, 'certificatedIMG', '')}></ImgPreview>
                    </Card>
                    {/* TODO: 随听书功能上线时解开注释 */}
                    {/* <Card type="inner" style={{ marginTop: 15 }}>
                        <Row>
                            <Col span={12}>
                                审核人: {_.get(verifyInfo, 'mobile', '')}
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                审核时间: <span>{moment(_.get(verifyInfo, 'createTime', '')).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </Col>
                        </Row>
                    </Card> */}
                    {_.get(verifyInfo, 'certificationStatus', '') === 'PASS' ? <div className={styles.icon_no_pass}>审核通过</div> : ""}
                    {_.get(verifyInfo, 'certificationStatus', '') === 'NO_PASS' ? <div className={styles.icon_passed}>审核不通过</div> : ""}
                    {/* {_.get(verifyInfo, 'certificationStatus', '')==='TO_AUDIT'?<div></div>:""}
                    {_.get(verifyInfo, 'certificationStatus', '')==='NO_SUBMIT'?<div></div>:""} */}
                </Card>
            </div>
        )
    }

}
