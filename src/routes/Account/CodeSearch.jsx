import { PureComponent } from 'react';
import { Form, Card, Input, Spin, Divider, Row, Col, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './Search.less';

const { Item: FormItem } = Form;

let interval;
@connect(state => ({
    code: state.code,
}))
export default class CodeSearch extends PureComponent {

    state = {
        remainTime: 0
    }

    searchCode(phoneNumber) {
        this.props.dispatch({
            type: 'code/queryAnyCode',
            payload: phoneNumber
        })
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'code/setData',
            payload: {
                theCode: null
            }
        })
    }

    componentWillReceiveProps(newProps, preProps) {
        const that = this;
        clearInterval(interval)
        if (!_.has(preProps, 'code.theCode')) {
            // 判断第一次拿到验证码数据，否则不开始
            let remain = _.get(newProps, 'code.theCode.seconds');
            if (remain) {
                interval = setInterval(function () {
                    console.log('定时器')
                    if (--remain <= 0) {
                        clearInterval(interval)
                        that.setState({
                            remainTime: '已失效'
                        })
                    }
                    that.setState({
                        remainTime: remain + 's'
                    })
                }, 1000)
            }
        }
    }

    render() {

        const that = this;

        let { theCode } = this.props.code;

        const toolbar = (
            <Form layout='inline' className={styles.tool_bar}>
                <Input.Search
                    style={{ width: 300 }}
                    enterButton={true}
                    maxLength={11}
                    placeholder="请输入手机号"
                    onSearch={(values) => {
                        this.searchCode(values)
                    }}
                ></Input.Search>
            </Form >
        )

        let detailBlock = (
            <Card title={_.get(theCode, 'mobile', '-')}>
                <Row>
                    <Col>
                        验证码：{_.get(theCode, 'checkCode')}
                    </Col>
                    <Col>
                        剩余时间：{this.state.remainTime}
                    </Col>
                </Row>
            </Card >
        )

        return (
            <Spin spinning={false}>
                {toolbar}
                {theCode !== null ? detailBlock : null}
            </Spin>
        )

    }
}
