import React, { Component } from "react";
import { connect } from "dva";
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
import { routerRedux, Link } from "dva/router";
import styles from "./Login.less";

const FormItem = Form.Item;
const InputGroup = Input.Group;

@connect(state => ({
    login: state.login
}))
@Form.create()
export default class Register extends Component {

    render() {
        return (
            <div className={styles.main}>
                <Form onSubmit={this.handleSubmit}>
                    <Tabs
                        animated={false}
                        className={styles.tabs}
                        activeKey={type}
                        onChange={this.onSwitch}
                    >
                        <TabPane tab="" key="account">
                            {login.status === "error" &&
                                login.type === "account" &&
                                login.submitting === false &&
                                this.renderMessage("账户或密码错误")}
                            <FormItem>
                                {getFieldDecorator("userName", {
                                    rules: [
                                        {
                                            required: type === "account",
                                            message: "请输入账户名！"
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
                                        placeholder="admin"
                                    />
                                    )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("password", {
                                    rules: [
                                        {
                                            required: type === "account",
                                            message: "请输入密码！"
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
                                        placeholder="888888"
                                    />
                                    )}
                            </FormItem>
                        </TabPane>
                    </Tabs>
                    <FormItem className={styles.additional}>
                        <Button
                            size="large"
                            loading={login.submitting}
                            className={styles.submit}
                            type="primary"
                            htmlType="submit"
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>);
    }
}
