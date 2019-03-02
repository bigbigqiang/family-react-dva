import { PureComponent } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Form, Col, Row, Button, Icon, Input, Radio, Select, Card, InputNumber } from 'antd';
import { getParameter, cacheManager } from '../../utils/utils';
import { dict } from '../../utils/dict';
import moment from 'moment';

const { Item: FormItem } = Form;

@connect(state => ({
    garden: state.garden,
    authority: state.authority
}))
@Form.create()
export default class GardenDetail extends PureComponent {

    componentDidMount() {
        const from = getParameter('from');
        const kindergartenCode = getParameter('kindergartenCode') || null;
        const businessCode = getParameter('businessCode') || null;
        this.props.dispatch({
            type: 'garden/getDetail',
            payload: {
                kindergartenCode
            }
        })
        this.props.dispatch({
            type: 'authority/fetchRoles',
            payload: {}
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const kindergartenCode = getParameter('kindergartenCode') || null;
        const uid = cacheManager.get('uid');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'garden/updateDetail',
                    payload: { ...values, kindergartenCode, uid }
                })
            }
        });
    }

    render() {
        const routeFrom = getParameter('from');
        const businessCode = getParameter('businessCode') || null;

        const { getFieldDecorator } = this.props.form;

        const { settingInfo } = this.props.garden;
        const { rolesData } = this.props.authority;

        return (
            <div>
                <Row>
                    <Col>
                        <Button>
                            <Link to={`/account/${routeFrom}?type=back${businessCode ? '&businessCode=' + businessCode : ''}`}>
                                <Icon type="left" />返回幼儿园列表
                            </Link>
                        </Button>
                    </Col>
                </Row>
                <Card title="园所详情" loading={false}>
                    <Form layout="inline" hideRequiredMark={true} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="园所名称">
                                    {getFieldDecorator('kindergartenName', {
                                        initialValue: _.get(settingInfo, 'kindergartenName'),
                                        rules: [{
                                            required: true,
                                            message: '请输入园所名称',
                                        }],
                                    })(
                                        <Input placeholder="请输入园所名称"></Input>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="园所联系人">
                                    {getFieldDecorator('contacter', {
                                        initialValue: _.get(settingInfo, 'contacter'),
                                        rules: [{
                                            required: true,
                                            message: '请输入园所联系人',
                                        }],
                                    })(
                                        <Input placeholder="请输入园所联系人"></Input>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="联系人电话">
                                    {/* {getFieldDecorator('masterPhone', {
                                        initialValue: _.get(settingInfo, 'telephone'),
                                        rules: [{
                                            required: true,
                                            message: '请输入联系人电话',
                                        }],
                                    })(
                                        <Input placeholder="请输入联系人电话"></Input>
                                    )} */}
                                    {_.get(settingInfo, 'telephone')}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="园所地址">
                                    {getFieldDecorator('kindergartenAddress', {
                                        initialValue: _.get(settingInfo, 'kindergartenAddress'),
                                        rules: [{
                                            required: true,
                                            message: '请输入园所地址',
                                        }],
                                    })(
                                        <Input placeholder="请输入园所地址"></Input>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="所属合伙人">
                                    {/* {getFieldDecorator('partnerName', {
                                        initialValue: _.get(settingInfo, 'partnerName'),
                                        rules: [{
                                            required: true,
                                            message: '请输入所属合伙人',
                                        }],
                                    })(
                                        <Input placeholder="请输入所属合伙人"></Input>
                                    )} */}
                                    {_.get(settingInfo, 'partnerName')}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="园所性质">
                                    {getFieldDecorator('nature', {
                                        initialValue: _.get(settingInfo, 'nature'),
                                        rules: [{
                                            required: true,
                                            message: '园所性质',
                                        }],
                                    })(
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value="private">私立</Radio.Button>
                                            <Radio.Button value="public">公立</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            {/* <Col span={8}>
                                <FormItem label="班级上限数">
                                    {getFieldDecorator('maxClassNum', {
                                        initialValue: _.get(settingInfo, 'maxClassNum'),
                                        rules: [{
                                            required: true,
                                            message: '请输入班级上限数',
                                        }],
                                    })(
                                        <InputNumber min={_.get(settingInfo, 'maxClassNum', 0) * 1} />
                                    )}
                                </FormItem>
                            </Col> */}
                            <Col span={8}>
                                <FormItem label="教师账号上限数">
                                    {getFieldDecorator('maxTeacherNum', {
                                        initialValue: _.get(settingInfo, 'maxTeacherNum'),
                                        rules: [{
                                            required: true,
                                            message: '请输入教师账号上限数',
                                        }],
                                    })(
                                        <InputNumber min={_.get(settingInfo, 'maxTeacherNum', 0) * 1} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="创建时间">
                                    {/* {getFieldDecorator('createTime', {
                                        initialValue: _.get(settingInfo, 'createTime'),
                                        rules: [{
                                            required: true,
                                            message: '请输入创建时间',
                                        }],
                                    })(
                                        <Input placeholder="请输入创建时间"></Input>
                                    )} */}
                                    <span title={moment(_.get(settingInfo, 'createTime')).format('YYYY-MM-DD HH:mm:ss')}>
                                        {moment(_.get(settingInfo, 'createTime')).format('YYYY-MM-DD')}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="销售方式">
                                    {getFieldDecorator('saleType', {
                                        initialValue: _.get(settingInfo, 'saleType'),
                                        rules: [{
                                            required: true,
                                            message: '请选择销售方式',
                                        }],
                                    })(
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value="online">线上支付</Radio.Button>
                                            <Radio.Button value="offline">线下实体卡兑换</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="课程状态">
                                    {getFieldDecorator('scheduleStatus', {
                                        initialValue: _.get(settingInfo, 'scheduleStatus'),
                                        rules: [{
                                            required: true,
                                            message: '请选择课程状态',
                                        }],
                                    })(
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value="show">开启</Radio.Button>
                                            <Radio.Button value="hidden">不开启</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="PC端权限">
                                    {getFieldDecorator('roleList', {
                                        initialValue: _.get(settingInfo, 'roleList'),
                                    })(
                                        <Select style={{ width: 80 }}>
                                            <Select.Option value={""}>无权限</Select.Option>
                                            {_.get(rolesData, 'roleList', []).map(item => {
                                                return <Select.Option value={item.roleCode} key={item.roleCode}>{item.roleName}</Select.Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>
                        <Row style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">确定修改</Button>
                        </Row>

                    </Form>
                </Card>
            </div>
        )
    }

}
