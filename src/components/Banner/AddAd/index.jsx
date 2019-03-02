import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Radio, Button, Upload, Icon, message, Select, Tabs, Checkbox } from 'antd';
import { connect } from 'dva';
import { server } from '../../../utils/utils';
import { xhr_upload } from '../../../utils/xhr_upload'
import styles from './index.less'
const FormItem = Form.Item;
const { Option } = Select;
@connect(state => ({
    adbanner: state.adbanner
}))
@Form.create()
export default class AddAd extends Component {
    state = {
        typeTrue: true,
        uploading: false,
        PreViewImageUrl: null,
        modalData: {}
    }

    handleCancel = (e) => {
        this.props.dispatch({
            type: 'adbanner/setModalVisible',
            payload: false
        })
        this.setState({ PreViewImageUrl: '' });
    }
    handleOk = (e) => {
        const { validateFields, getFieldValue } = this.props.form;
        const { PreViewImageUrl } = this.state;
        const { adbanner: { sortDetails, targetType, targetPage } } = this.props;
        validateFields((err, values) => {
            if (err) {
                console.log('err', err);
                return false;
            }
            if (targetType) {
                let link;
                switch (values.targetType) {
                    case 'SYSTEM_INTERFACE':
                        link = this.refs.link1;
                        console.log('link1:', link.props.value);
                        values.targetPage = link.props.value;
                        break;
                    case 'CUSTOM':
                        link = this.refs.link2;
                        console.log('link2:', link.props.value);
                        values.targetPage = link.props.value;
                        break;
                    case 'H5':
                        link = document.getElementById('link3');
                        console.log('link3:', link.value);
                        values.targetPage = link.value;
                        break;
                }
            }
            // message.error(PreViewImageUrl);
            if (!PreViewImageUrl) {
                //没有新上传的图片,去找旧数据sortDetails.imageUrl
                if (!sortDetails) {
                    //旧数据sortDetails都没有,说明是添加逻辑
                    message.error('没传图片!')
                }
                else {
                    values.imageUrl = sortDetails.imageUrl;
                }
            }
            else {
                values.imageUrl = PreViewImageUrl;
            }

            // console.log("*********************************************");
            values.adCode = sortDetails.adCode;
            values.targetType = targetType ? targetType : sortDetails.targetType;
            values.targetPage = targetPage;

            if (!values.targetPage) {
                message.error('目标链接为空!')
            }

            // console.log(values);

            this.props.dispatch({
                type: 'adbanner/addAds',
                payload: values
            })

            this.setState({
                PreViewImageUrl: ''
            })
        })
    }

    render() {

        const {
            adbanner: {
                sortParams, customParams, systemParams,
                visible,
                sortDetails, targetPage },
            form: { getFieldDecorator, getFieldValue }
        } = this.props;
        const { PreViewImageUrl, uploading, typeTrue } = this.state;
        let { adbanner: { targetType } } = this.props;
        targetType = targetType ? targetType : sortDetails ? sortDetails.targetType : '数据异常'
        // console.log(sortDetails);
        const uploadButton = (
            <div>
                <Icon type={uploading ? 'loading' : 'plus'} />
                <div>点击上传图片<br />尺寸参考 690*230</div>
            </div>
        );

        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 16 },
            },
        };
        const upload_props = {
            name: "banner",
            listType: "picture-card",
            showUploadList: false,
            // TODO: 需要修改上传地址,
            customRequest: (args) => {
                const ThisComponent = this;
                ThisComponent.setState({
                    loading: true
                })

                /**
                 * @description 如果图片格式校验没问题，则开始上传
                 */
                ThisComponent.state.typeTrue ?
                    xhr_upload(server.imgUploadUrl, {
                        'file': args.file
                    }).then(res => {
                        ThisComponent.setState({
                            loading: false,
                            PreViewImageUrl: res.data
                        })
                    }).catch(err => {
                        console.error(err)
                    }) : setTimeout(() => {
                        // 如果图片格式不对，或者图片尺寸不对，1s后可以重新选择图片
                        ThisComponent.setState({
                            loading: false,
                            typeTrue: true
                        })
                    }, 1000)
            },
            beforeUpload: (file) => {
                const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'; // TODO: 不确定
                if (!isJPGOrPNG) {
                    message.error('请上传JPG或PNG图片!');
                    message.error('已将图片还原');
                    this.setState({
                        typeTrue: false,
                        PreViewImageUrl: ''
                    })
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('图片必须小于2MB!');
                    message.error('已将图片还原');
                    this.setState({
                        typeTrue: false,
                        PreViewImageUrl: ''
                    })
                }
            }
        }

        return (
            visible ? <Modal
                width={960}
                title="添加广告横幅"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={
                    [
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            保存
                        </Button>
                    ]}
            >
                <Form>
                    <Row style={{ paddingTop: '30px' }}
                        gutter={4}>
                        <Col span={8}>
                            <Upload {...upload_props} className={styles.img_upload} >
                                {
                                    PreViewImageUrl && uploading == false && typeTrue ?
                                        <img className={styles.preview_image} src={PreViewImageUrl} alt="" /> :
                                        sortDetails && sortDetails.imageUrl ?
                                            <img className={styles.preview_image} src={sortDetails.imageUrl} alt="" /> : uploadButton
                                }
                            </Upload>
                        </Col>
                        <Col className={styles.upload_right}>
                            <FormItem label="图片标题"
                                {...formItemLayout}>
                                {getFieldDecorator('imageTitle', {
                                    initialValue: _.get(sortDetails, 'imageTitle', ''),
                                    rules: [{
                                        required: true, message: '请输入广告标题!',
                                    }],
                                })(
                                    <Input type="text" placeholder="请输入..."></Input>
                                )}
                            </FormItem>
                            <FormItem label="图片简介"
                                {...formItemLayout}>
                                {getFieldDecorator('imageDesc', {
                                    initialValue: _.get(sortDetails, 'imageDesc', ''),
                                    rules: [{
                                        required: true, message: '请输入广告简介!',
                                    }],
                                })(
                                    <Input type="text" placeholder="请输入..."></Input>
                                )}
                            </FormItem>
                            <FormItem label="链接目标"
                                {...formItemLayout}>
                                <Row>
                                    <Col span={8}>
                                        <Select value={targetType} onChange={(value) => {
                                            this.props.dispatch({
                                                type: 'adbanner/setTargetType',
                                                payload: value
                                            })
                                            this.props.dispatch({
                                                type: 'adbanner/setTargetPage',
                                                payload: ''
                                            })
                                            this.setState({
                                                modalData: { ...this.state.modalData },
                                                selectValue: value
                                            })

                                        }}>
                                            {
                                                sortParams.map((item, index) => {
                                                    return <Option key={index} value={item.targetType}>
                                                        {item.targetTypeDesc}
                                                    </Option>
                                                })
                                            }
                                        </Select>
                                    </Col>
                                    <Col span={15} offset={1}>
                                        {
                                            targetType == 'SYSTEM_INTERFACE' || this.state.selectValue == 'SYSTEM_INTERFACE' ?
                                                <Select ref="link1" value={targetPage} onChange={value => {
                                                    this.props.dispatch({
                                                        type: 'adbanner/setTargetPage',
                                                        payload: value
                                                    })
                                                    this.setState({
                                                        modalData: { ...this.state.modalData, targetPage: value }
                                                    })
                                                }}>
                                                    {
                                                        systemParams.map((item, index) => {
                                                            return <Option key={index} value={item.value}>
                                                                {item.key}
                                                            </Option>
                                                        })
                                                    }
                                                </Select> : targetType == 'CUSTOM' || this.state.selectValue == 'CUSTOM' ?
                                                    <Select ref="link2" value={targetPage} onChange={value => {
                                                        this.props.dispatch({
                                                            type: 'adbanner/setTargetPage',
                                                            payload: value
                                                        })
                                                    }}>
                                                        {
                                                            customParams.map((item, index) => {
                                                                return <Option key={index} value={item.value}>
                                                                    {item.key}
                                                                </Option>
                                                            })
                                                        }
                                                    </Select> : targetType == 'H5' || this.state.selectValue == 'H5' ?
                                                        <Input id="link3" defaultValue={targetPage} onChange={e => {
                                                            this.props.dispatch({
                                                                type: 'adbanner/setTargetPage',
                                                                payload: e.target.value
                                                            })
                                                        }}></Input> : ''
                                        }
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal> : ''
        )
    }
}
