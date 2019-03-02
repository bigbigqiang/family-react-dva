
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Upload, Button, Select, Icon, message } from 'antd';
import styles from './index.less';
import { xhr_upload } from '../../utils/xhr_upload';
import { server } from '../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => ({
    appclass: state.appclass
}))
@Form.create()
export default class SetAppClass extends Component {
    state = {
        typeTrue: true,
        uploading: false,
        PreViewImageUrl: null,
        modalData: {}
        // oldPreViewImageUrl: 'https://goss.veer.com/creative/vcg/veer/800water/veer-302985744.jpg',
    }
    handleCancel = (e) => {
        this.props.dispatch({
            type: 'appclass/update',
            payload: { visible: false }
        })
        this.setState({ PreViewImageUrl: '' });
    }
    handleOk = (e) => {
        const { validateFields, getFieldValue } = this.props.form;
        const { PreViewImageUrl } = this.state;
        const { appclass: { sortDetails, targetPage } } = this.props;
        validateFields((err, values) => {
            if (err) {
                console.log('err', err)
            }
            if (targetPage) {
                let link;
                switch (values.targetType) {
                    case 'SYSTEM_INTERFACE':
                        link = this.refs.link1;
                        values.targetPage = link.props.value;
                        break;
                    case 'CUSTOM':
                        link = this.refs.link2;
                        values.targetPage = link.props.value;
                        break;
                    case 'H5':
                        link = document.getElementById('link3');
                        values.targetPage = link.value;
                        break;
                }
            }
            if (!PreViewImageUrl) {
                //没有新上传的图片,去找旧数据sortDetails.imageUrl
                if (!sortDetails) {
                    message.error('没传图片!')
                }
                else {
                    values.imageUrl = sortDetails.imageUrl;
                }
            }
            else {
                values.imageUrl = PreViewImageUrl;
            }
            if (!values.targetPage) {
                message.error('目标链接为空!')
            }
            values.sortCode = sortDetails.sortCode;
            this.props.dispatch({
                type: 'appclass/updateSort',
                payload: values
            }, this.setState({ PreViewImageUrl: '' }))
        })
    }
    render() {
        const {
            appclass: {
                sortParams, customParams, systemParams,
                visible,
                sortDetails, targetPage },
            form: { getFieldDecorator, getFieldValue }
        } = this.props;
        const { PreViewImageUrl, uploading, typeTrue } = this.state;
        let { appclass: { targetType } } = this.props;
        targetType = targetType ? targetType : sortDetails ? sortDetails.targetType : '数据异常';

        const uploadButton = (
            <div>
                <Icon type={uploading ? 'loading' : 'plus'} />
                <div>点击上传图片<br />尺寸参考 330*330</div>
            </div>
        );

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const upload_props = {
            name: "classImg",
            listType: "picture-card",
            showUploadList: false,
            // TODO: 需要修改上传地址,
            customRequest: (args) => {
                let ThisComponent = this;
                ThisComponent.setState({
                    uploading: true
                })

                /**
                 * @description 如果图片格式校验没问题，则开始上传
                 */
                ThisComponent.state.typeTrue ?
                    xhr_upload(server.imgUploadUrl, {
                        'file': args.file
                    }).then(res => {
                        ThisComponent.setState({
                            uploading: false,
                            PreViewImageUrl: res.data
                        })
                    }).catch(err => {
                        console.error(err)
                    }) : setTimeout(() => {
                        // 如果图片格式不对，或者图片尺寸不对，1s后可以重新选择图片
                        ThisComponent.setState({
                            uploading: false,
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
                width={780}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
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
                                        <img className={styles.imgSize} src={PreViewImageUrl} alt="" /> :
                                        sortDetails && sortDetails.imageUrl ?
                                            <img className={styles.imgSize} src={sortDetails.imageUrl} alt="" /> : uploadButton
                                }
                            </Upload>
                        </Col>
                        <Col span={16}>
                            <FormItem label="分类标题"
                                {...formItemLayout}>
                                {getFieldDecorator('sortTitle', {
                                    initialValue: _.get(sortDetails, 'sortTitle', ''),
                                    rules: [{
                                        required: true, message: '请输入分类标题!',
                                    }],
                                })(
                                    <Input type="text" placeholder="请输入..."></Input>
                                )}
                            </FormItem>
                            <FormItem label="链接目标"
                                {...formItemLayout}>
                                <Row>
                                    <Col span={8}>
                                        {getFieldDecorator('targetType', {
                                            initialValue: _.get(sortDetails, 'targetType', ''),
                                        })(
                                            <Select onChange={(value) => {
                                                this.props.dispatch({
                                                    type: 'appclass/update',
                                                    payload: { targetType: value }
                                                })
                                                this.setState({
                                                    modalData: { ...this.state.modalData, targetPage: '' }
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
                                        )}
                                    </Col>
                                    <Col span={15} offset={1}>
                                        {
                                            targetType == 'SYSTEM_INTERFACE' ?
                                                <Select ref="link1" value={targetPage} onChange={value => {
                                                    this.props.dispatch({
                                                        type: 'appclass/update',
                                                        payload: { targetPage: value }
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
                                                </Select> : targetType == 'CUSTOM' ?
                                                    <Select ref="link2" value={targetPage} onChange={value => {
                                                        this.props.dispatch({
                                                            type: 'appclass/update',
                                                            payload: { targetPage: value }
                                                        })
                                                        this.setState({
                                                            modalData: { ...this.state.modalData, targetPage: value }
                                                        })
                                                    }}>
                                                        {
                                                            customParams.map((item, index) => {
                                                                return <Option key={index} value={item.value}>
                                                                    {item.key}
                                                                </Option>
                                                            })
                                                        }
                                                    </Select> : targetType == 'H5' ?
                                                        <Input id="link3" defaultValue={targetPage} onChange={e => {
                                                            this.props.dispatch({
                                                                type: 'appclass/update',
                                                                payload: { targetPage: e.target.value }
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