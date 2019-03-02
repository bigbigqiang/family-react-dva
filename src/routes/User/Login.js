import React, { PureComponent } from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import {
    Form,
    Input,
    Tabs,
    Button,
    Icon,
    Checkbox,
    Row,
    Col,
    Alert
} from "antd";
import styles from "./Login.less";
import lodash from 'lodash';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
    login: state.login
}))
@Form.create()
export default class Login extends PureComponent {

    state = {
        count: 0,
        type: "account"
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onSwitch = type => {
        this.setState({ type });
    };

    onGetCaptcha = () => {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
                clearInterval(this.interval);
            }
        }, 1000);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "login/login",
                    payload: {
                        // TODO: 关于账号加密，可以在这里MD5加密
                        ...values,
                        type: this.state.type
                    }
                });
            }
        });
    };

    renderMessage = message => {
        return (
            <Alert
                style={{ marginBottom: 24 }}
                message={message}
                type="error"
                showIcon
            />
        );
    };

    render() {
        const { form, login } = this.props;
        const { getFieldDecorator } = form;
        const { count, type } = this.state;
        return (
            <div className={styles.main}>
                <Form onSubmit={this.handleSubmit}>
                    {login.status === "error" &&
                        login.type === "account" &&
                        // login.submitting === false &&
                        this.renderMessage("账户或密码错误")}
                    <FormItem>
                        {getFieldDecorator("userName", {
                            rules: [
                                {
                                    required: type === "account",
                                    message: "请输入账户名"
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                prefix={
                                    <Icon
                                        type="user"
                                        className={styles.prefixIcon}
                                    />
                                }
                                placeholder="请输入账户名！"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: type === "account",
                                    message: "请输入密码"
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                prefix={
                                    <Icon
                                        type="lock"
                                        className={styles.prefixIcon}
                                    />
                                }
                                type="password"
                                placeholder="请输入密码！"
                            />
                        )}
                    </FormItem>
                    <FormItem className={styles.additional}>
                        <Button
                            size="large"
                            // loading={login.submitting}
                            className={styles.submit}
                            type="primary"
                            htmlType="submit"
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
