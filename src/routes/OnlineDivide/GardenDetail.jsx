import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Card, Form, Row, Col, Button, Icon, Switch, Table, Modal, Radio } from 'antd';
import { DivideChanger } from '../../components/DivideChanger';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import moment from 'moment';

const { Item: FormItem } = Form;
const RadioGroup = Radio.Group;
@connect(state => ({
    divide: state.divide
}))
@Form.create()
export default class GardenDetail extends PureComponent {

    getDetail(args) {
        let { kindergartenCode } = getParameter();
        this.props.dispatch({
            type: 'divide/getKindergartenShareRatios',
            payload: {
                kindergartenCode,
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

        let { divide: { loading, showEdit, gartenDetail, editNotice } } = this.props;


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
                    <Link to="/divide/garden">
                        <Button><Icon type="left" />返回幼儿园收益列表</Button>
                    </Link>
                </Row>
                <Card>
                    <Form>
                        <Row>
                            <Col span={12}>
                                {/* <FormItem> */}
                                幼儿园名称：{_.get(gartenDetail, 'kindergartenName', '')}
                                {/* </FormItem> */}
                            </Col>
                            <Col span={12}>
                                {/* <FormItem> */}
                                园长手机号：{_.get(gartenDetail, 'headmasterPhone', '')}
                                {/* </FormItem> */}
                            </Col>
                            <Col span={12}>
                                {/* <FormItem> */}
                                所属合伙人：{_.get(gartenDetail, 'partnerName', '')}
                                {/* </FormItem> */}
                            </Col>
                            <Col span={12}>
                                {/* <FormItem> */}
                                合伙人手机号：{_.get(gartenDetail, 'partnerPhone', '')}
                                {/* </FormItem> */}
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col span={12}>
                            园长收益权限：<RadioGroup   onChange={(e)=>{
                            let { kindergartenCode } = getParameter();
                            this.setState({
                                value: e.target.value
                            });
                            this.props.dispatch({
                                type: 'divide/editKindergartenShareRatioShow',
                                payload: {
                                    kindergartenCode,
                                    show:e.target.value
                                }
                            })
                        }}>
                                <Radio value="0" checked={_.get(gartenDetail, 'sharePermission', '') == '0'}>无权查看</Radio>
                                <Radio value="1" checked={_.get(gartenDetail, 'sharePermission', '') == '1'}>查看收益</Radio>
                                <Radio value="2" checked={_.get(gartenDetail, 'sharePermission', '') == '2'}>查看订单</Radio>
                            </RadioGroup>
                            {/* </FormItem> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            {/* <FormItem> */}
                            当前分成比例：{_.get(gartenDetail, 'kindergartenCurrentShareRatio', 0)}%
                            {/* </FormItem> */}
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
                                dataSource={_.get(gartenDetail, 'shareRatioApplies', [])}
                                size="small"
                                bordered
                                footer={() => {
                                    return `修改比例次数： ${_.get(gartenDetail, 'count', 0)}`
                                }}
                                pagination={{
                                    total: _.get(gartenDetail, 'count', 0),
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
                    title={_.get(gartenDetail, 'kindergartenName', '')}
                    description="幼儿园分成比例设置为"
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
                        let { kindergartenCode } = getParameter();
                        let applyUid = cacheManager.get('uid')
                        this.props.dispatch({
                            type: 'divide/editKindergartenShareRatio',
                            payload: {
                                kindergartenCode,
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
