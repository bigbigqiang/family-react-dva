import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Card, Form, Row, Col, Button, Icon, Switch, Table, Modal } from 'antd';
import { DivideChanger } from '../../components/DivideChanger';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import moment from 'moment';

const { Item: FormItem } = Form;
@connect(state => ({
    divide: state.divide
}))
@Form.create()
export default class PartnerDetail extends PureComponent {

    getDetail(args) {
        let { partnerUid } = getParameter();
        this.props.dispatch({
            type: 'divide/getPartnerShareRatios',
            payload: {
                partnerUid,
                ...args
            }
        })
    }

    componentDidMount() {
        this.getDetail({
            pageNo: 1,
            pageSize: 10
        })
    }

    render() {

        const that = this;

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        let { divide: { loading, showEdit, partnerDetail, editNotice } } = this.props;
        console.log(partnerDetail)

        const columns = [{
            title: '期望比例',
            dataIndex: 'toRatio',
            render(text) {
                return text + '%'
            }
        }, {
            title: '申请账号',
            dataIndex: 'applyPhone'
        }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            render(text) {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        }, {
            title: '审核账号',
            dataIndex: 'checkPhone'
        }, {
            title: '审核结果',
            dataIndex: 'checkResult',
            render(text) {
                return dict(text, {
                    prefix: 'APPROVAL',
                    type: 'badge'
                });
            }
        }, {
            title: '审核时间',
            dataIndex: 'checkTime',
            render(text) {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        }].map(item => {
            item.align = 'center';
            return item;
        })

        return (
            <Spin spinning={loading}>
                <Row>
                    <Link to="/divide/partner">
                        <Button><Icon type="left" />返回合伙人收益列表</Button>
                    </Link>
                </Row>
                <Card>
                    <Row>
                        <Col span={12}>
                            合伙人：{_.get(partnerDetail, 'partnerName', '')}
                        </Col>
                        <Col span={12}>
                            合伙人手机号：{_.get(partnerDetail, 'phone', '')}
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            当前公司分成比例：{_.get(partnerDetail, 'corpCurrentShareRatio', '')}%
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            {/* <FormItem> */}
                            <Button type="primary" onClick={() => {
                                this.props.dispatch({
                                    type: 'divide/setData',
                                    payload: {
                                        showEdit: true
                                    }
                                })
                            }}>添加修改申请</Button>
                            {/* </FormItem> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={_.get(partnerDetail, 'shareRatioApplies', [])}
                                size="small"
                                bordered
                                footer={() => {
                                    return `修改比例次数： ${_.get(partnerDetail, 'count', 0)}`
                                }}
                                pagination={{
                                    total: _.get(partnerDetail, 'count', 0),
                                    size: "small",
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    onChange: (pageNo, pageSize) => {
                                        that.getDetail({
                                            pageNo,
                                            pageSize
                                        })
                                    },
                                    onShowSizeChange: (pageNo, pageSize) => {
                                        that.getDetail({
                                            pageNo,
                                            pageSize
                                        })
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Card>
                <DivideChanger
                    visible={showEdit}
                    title={_.get(partnerDetail, 'partnerName', '')}
                    description="公司分成比例设置为"
                    notice={editNotice}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'divide/setData',
                            payload: {
                                showEdit: false,
                                editNotice: null
                            }
                        })
                    }}
                    onOk={(shareRatio) => {
                        let { partnerUid } = getParameter();
                        let applyUid = cacheManager.get('uid')
                        this.props.dispatch({
                            type: 'divide/editPartnerShareRatio',
                            payload: {
                                partnerUid,
                                applyUid,
                                shareRatio
                            }
                        })
                    }}
                />
            </Spin>
        )
    }
}
