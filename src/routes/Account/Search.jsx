import { PureComponent } from 'react';
import { Form, Card, Input, Spin, Divider, Row, Col, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import { dict } from '../../utils/dict'
import styles from './Search.less';
import moment from 'moment';
const FormItem = Form.Item;

@connect(state => ({
    account: state.account,
}))
@Form.create()
export default class AccountSearch extends PureComponent {

    searchAccount(phoneNumber) {
        this.props.dispatch({
            type: 'account/queryAnyAccount',
            payload: {
                phone: phoneNumber
            }
        })
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'account/setData',
            payload: {
                theAccount: null
            }
        })
    }

    render() {

        const that = this;

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        let { theAccount } = this.props.account;

        let isVip = _.get(theAccount, 'vipFlag') === "YES" && _.get(theAccount, 'vipType') !== "VIP_TRIAL";

        const toolbar = (
            <Form layout='inline' className={styles.tool_bar}>
                <Input.Search
                    style={{ width: 300 }}
                    enterButton={true}
                    maxLength={11}
                    placeholder="请输入手机号"
                    onSearch={(values) => {
                        this.searchAccount(values)
                    }}
                ></Input.Search>
            </Form >
        )

        let detailBlock = (
            <Card title={_.get(theAccount, 'userName') || _.get(theAccount, 'phone')}>
                <Row>
                    <Col span={24}>
                        手机号：{_.get(theAccount, 'phone') || ' -'}
                    </Col>
                    <Col span={24}>
                        姓名：{_.get(theAccount, 'userName') || ' -'} {_.get(theAccount, 'vipFlag') === 'YES' ? (_.get(theAccount, 'vipType') === 'VIP_TRIAL' ? '(体验期)' : '(VIP)') : ''}
                    </Col>
                    <Col span={24}>
                        身份：{_.get(theAccount, 'role', '') ? dict(_.get(theAccount, 'role', ''), { prefix: 'ACCOUNT' }) : ' -'}
                    </Col>
                    <Col span={24}>
                        注册时间：{_.get(theAccount, 'registerTime', '') ? moment(theAccount.registerTime).format('YYYY-MM-DD HH:mm:ss') : ' -'}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        会员到期时间：{_.get(theAccount, 'vipEndTime', '') ? moment(theAccount.vipEndTime).format('YYYY-MM-DD HH:mm:ss') : ' -'}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        所属幼儿园：{_.get(theAccount, 'kindergartenName') || ' -'}
                    </Col>
                    <Col span={24}>
                        所属合伙人：{_.get(theAccount, 'partnerName') || ' -'}
                    </Col>
                    <Col span={24}>
                        所在班级：{_.get(theAccount, 'classNames') || ' -'}
                    </Col>
                    <Col span={24}>
                        所在园激活家长数：{_.get(theAccount, 'userNum') || ' -'}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        上次登录APP时间：{_.get(theAccount, 'lastOpenTime', '') ? moment(theAccount.lastOpenTime).format('YYYY-MM-DD HH:mm:ss') : ' -'}
                    </Col>
                    <Col span={24}>
                        上次登录APP版本：{_.get(theAccount, 'lastAppVersion') || ' -'}
                    </Col>
                    <Col span={24}>
                        上次登录APP手机型号：{_.get(theAccount, 'lastResource') || ' -'}
                    </Col>
                </Row>
                <Row>
                    <Popconfirm title={isVip ? '该用户是会员，无法注销' : '删除账号，会导致该手机号码的历史记录将无法找回，确定删除？'} onConfirm={() => {
                        if (!isVip) {
                            this.props.dispatch({
                                type: 'account/stopAccount',
                                payload: { uid: _.get(theAccount, 'uid') }
                            })
                        }
                    }}>
                        <Button
                            type="primary"
                            style={{ display: !/(HEADMASTER|PARENT|TEACHER)/.test(_.get(theAccount, 'role')) ? 'none' : 'block' }}
                        >
                            注销账户
                        </Button>
                    </Popconfirm>
                </Row>
            </Card >
        )

        return (
            <Spin spinning={false}>
                {toolbar}
                {theAccount !== null ? detailBlock : null}
            </Spin>
        )

    }
}
