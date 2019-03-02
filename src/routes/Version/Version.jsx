import React, { PureComponent } from "react";
import { connect } from 'dva';
import { Form, Button, Radio, Input, Upload, Icon, Spin } from "antd";
import styles from "./Version.less";
// import { server } from '../../utils/utils';
// import { xhr_upload } from '../../utils/xhr_upload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
let myClear;

@connect(state => ({
    version: state.version
}))
@Form.create()
export default class Version extends PureComponent {
    state = {
        payload: {},
        fileList: [],
        isIOS: false,
        loading: false
    }
    //Function([fieldNames: string[]], options: object, callback: Function(errors, values))
    handleSubmit = (e) => {
        e.preventDefault();
        const { isIOS } = this.state;
        const fieldNames = isIOS ? ['versionResource', 'versionNum', 'enforceUpdate'] :
            ['versionResource', 'versionNum', 'enforceUpdate', 'description', 'file'];
        this.props.form.validateFields(fieldNames, { first: true }, (err, values) => {
            if (!err) {
                this.setState({ loading: true });
                this.props.dispatch({
                    type: 'version/versionCommit',
                    payload: {
                        versionResource: values.versionResource,
                        versionNum: values.versionNum,
                        description: values.description,       //版本描述
                        file: this.state.fileList[0],          //安装包
                        enforceUpdate: values.enforceUpdate    //default/custom 默认课表/自定义课表
                    }
                }).then(() => {
                    console.log('123')
                    this.setState({ loading: false, fileList: [] })
                    myClear = setTimeout(this.props.form.resetFields, 100);
                })
            }
        });
    }
    componentWillUnmount() {
        clearTimeout(myClear)
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isIOS } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const that = this;
        const uploadprops = {
            fileList: this.state.fileList,
            onChange({ file, fileList }) {
                if (file.status !== 'uploading') {
                    console.log(file, fileList);
                }
            },
            beforeUpload(file) {
                that.setState({
                    fileList: [file],
                    payload: that.props.form.getFieldsValue()
                })
                return false;
            }
        };
        return (
            <div className={styles.form}>
                {
                    this.state.loading ? <div style={{ position: 'fixed', zIndex: 1000, width: '100%', height: '100%', background: 'rgba(255,255,255,0.3)', left: 0, top: 0 }}>
                        <Spin style={{ lineHeight: '100%', height: '100%', top: '50%', position: 'inherit', width: '100%' }}></Spin>
                    </div> : ''
                }
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="更新产品:">
                        {getFieldDecorator('versionResource', {
                            initialValue: 'android'
                        })(
                            <RadioGroup onChange={(e) => {
                                // console.log(e.target.value);
                                this.setState({
                                    isIOS: e.target.value == 'ios'
                                });
                            }}>
                                <RadioButton value='android'>动画绘本馆安卓</RadioButton >
                                <RadioButton value='ios'>动画绘本馆IOS</RadioButton >
                                <RadioButton value='ellamanager'>咿啦管家</RadioButton >
                                <RadioButton value='uellapiclib'>咿啦动画图书馆</RadioButton >
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="版本号:">
                        {getFieldDecorator('versionNum', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入正确的版本号!纯数字格式:X.X.X',
                                    pattern: /^\d{1,2}\.\d{1,2}\.\d{1,2}$/
                                }
                            ]
                        })(
                            <Input style={{ width: 200 }} />
                        )}
                    </FormItem>
                    {!isIOS ? <FormItem
                        {...formItemLayout}
                        label="版本文件:">
                        {getFieldDecorator('file', {
                            rules: [{ required: true, message: '请点击上传版本文件!' }]
                        })(
                            <Upload {...uploadprops}>
                                <Button>
                                    <Icon type="upload" /> 点击上版本文件
                                </Button>
                            </Upload>
                        )}
                    </FormItem> : ''}
                    {!isIOS ? <FormItem
                        {...formItemLayout}
                        label="版本更新描述:">
                        {getFieldDecorator('description', {
                            initialValue: '无'
                        })(
                            <TextArea style={{ width: 400 }} autosize></TextArea>
                        )}
                    </FormItem> : ''}
                    {!isIOS ? <FormItem
                        {...formItemLayout}
                        label="远程文件夹:">
                        {getFieldDecorator('dictionary', {
                            initialValue: 'ellabook-public'
                        })(
                            <Input style={{ width: 200 }} disabled />
                        )}
                    </FormItem> : ''}
                    <FormItem
                        {...formItemLayout}
                        label="是否强制更新:">
                        {getFieldDecorator('enforceUpdate', {
                            initialValue: '1'
                        })(
                            <RadioGroup>
                                <Radio value='1'>是</Radio>
                                <Radio value='0'>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem className={styles.submit}>
                        <Button className={styles.submitbtn} type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
