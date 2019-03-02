/**
 * @description 很可怕大兄弟，关于图片上传，我参考的官方Demo，地址见下
 * https://ant.design/components/upload-cn/
 * 更可怕的是，这是一个弹窗里面弹弹窗的需求，很刺激
 */
import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Radio, Button, Upload, Icon, message, Select, Tabs, Checkbox } from 'antd';
import { getBase64, Base64toBlob } from '../../../utils/utils';
import { server } from '../../../utils/utils';
import request from '../../../utils/request';
import { xhr_upload } from '../../../utils/xhr_upload'
import styles from './index.less'

import { setTimeout } from 'timers';

const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

@Form.create()
export default class AddBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nowAim: 'H5',
            file: null,
            PreViewImageUrl: '',
            fileList: [],
            loading: false,
            typeTrue: true      // 当前图片格式是否正确
        }
    }

    render() {

        const { PreViewImageUrl, loading } = this.state;
        const { nowEditBanner } = this.props;
        const { getFieldDecorator } = this.props.form;

        const upload_props = {
            name: "banner",
            listType: "picture-card",
            showUploadList: false,
            // TODO: 需要修改上传地址,
            customRequest: (args) => {
                // console.log(args)
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
                const isJPG = file.type === 'image/jpeg'; // TODO: 不确定
                if (!isJPG) {
                    message.error('请上传JPG图片!');
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

        const tabChange = (index) => {
            console.log(index)
            this.setState({
                nowAim: index
            });
        }

        const uploadButton = (
            <div>
                <Icon type={this.props.imgLoading || this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击上传图片：750*360 像素</div>
            </div>
        );

        const itemsize = 'default';

        return (
            this.props.visible && <Modal
                width={'960px'}
                title="添加新图片"
                visible={this.props.visible}
                onCancel={() => {
                    this.props.handleCancel();
                    this.setState({
                        PreViewImageUrl: ''
                    })
                }}
                footer={
                    [
                        <Button key="cancel" onClick={() => {
                            this.props.handleCancel()
                            this.setState({
                                PreViewImageUrl: ''
                            })
                        }
                        }>取消</Button>,
                        <Button key="draft" onClick={() => {
                            this.props.handleAdd({ type: 'EXCEPTION', PreViewImageUrl, nowEditBanner })
                            this.setState({
                                PreViewImageUrl: ''
                            })
                        }} type="primary">存为草稿</Button>,
                        <Button key="publish" onClick={() => {
                            this.props.handleAdd({ type: 'NORMAL', PreViewImageUrl, nowEditBanner })
                            this.setState({
                                PreViewImageUrl: ''
                            })
                        }} type="primary">保存并上线</Button>,
                    ]}
            >
                <Row>
                    <Col className={styles.upload_left}>
                        <Upload {...upload_props} className={styles.img_upload} >
                            {
                                PreViewImageUrl && loading == false && this.state.typeTrue ?
                                    <img className={styles.preview_image} src={PreViewImageUrl} alt="" /> :
                                    nowEditBanner && nowEditBanner.bannerImageUrl ?
                                        <img className={styles.preview_image} src={nowEditBanner.bannerImageUrl} alt="" /> :
                                        uploadButton
                            }
                        </Upload>
                    </Col>
                    <Col className={styles.upload_right}>
                        <Form layout='inline' hideRequiredMark={true}>
                            <Row>
                                <FormItem label="图片标题">
                                    {getFieldDecorator('bannerTitle', {
                                        initialValue: _.get(nowEditBanner, 'bannerTitle', ''),
                                        validateTrigger: 'onChange',
                                        rules: [{
                                            required: true,
                                            message: '请输入图片标题'
                                        }]
                                    })(
                                        <Input size={itemsize}></Input>
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="图片简介">
                                    {getFieldDecorator('bannerDesc', {
                                        initialValue: _.get(nowEditBanner, 'bannerDesc', ''),
                                    })(
                                        <Input size={itemsize}></Input>
                                    )}
                                </FormItem>
                            </Row>
                            <FormItem label="指定链接">
                                <Col>
                                    {getFieldDecorator('targetPage', {
                                        initialValue: _.get(nowEditBanner, 'targetType') === "H5" ? _.get(nowEditBanner, 'targetPage') : '',
                                    })(
                                        <Input size={itemsize}></Input>
                                    )}
                                </Col>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Modal >
        )
    }
}
