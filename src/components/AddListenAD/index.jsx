import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Button, Upload, Icon, message, Select } from 'antd';
import { connect } from 'dva';
import { server } from '../../utils/utils';
import { xhr_upload } from '../../utils/xhr_upload'
import styles from './index.less'
const FormItem = Form.Item;
const { Option } = Select;
@connect(state => ({
    listenad: state.listenad
}))
@Form.create()
export default class AddListenAD extends Component {
    state = {
        typeTrue: true,
        loading: false,
        PreViewImageUrl: null,
        modalData: {}
    }

    handleCancel = (e) => {
        this.props.dispatch({
            type: 'listenad/update',
            payload: { visible: false }
        })
        this.setState({ PreViewImageUrl: '' });
    }
    handleOk = (e) => {
        const { validateFields, getFieldValue } = this.props.form;
        const { PreViewImageUrl } = this.state;
        const { listenad: { sortDetails, targetType, targetPage } } = this.props;

        validateFields((err, values) => {
            values.adCode = sortDetails.adCode;
            values.pcUid=localStorage.getItem('ellahome_token');
            values.targetType = targetType ? targetType : sortDetails.targetType;
            values.targetPage = targetPage;
            if (err) {
                console.log('err', err);
                return false;
            }
            if (targetType) {
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

                }
            }

            if (!PreViewImageUrl) {
                if (sortDetails.length==0) {
                    message.error('没传图片!')
                    return false;
                }else {
                    values.imageUrl = sortDetails.imageUrl;
                }
            } else {
                values.imageUrl = PreViewImageUrl;
            }
            if (!values.targetPage) {
                message.error('目标链接为空!')
                return false;
            }
            this.props.dispatch({
                type: 'listenad/addAds',
                payload: values
            })
            this.setState({
                PreViewImageUrl: ''
            })
        })
    }

    render() {

        const {
            listenad: {
                sortParams, customParams, systemParams,
                visible,
                sortDetails, targetPage },
            form: { getFieldDecorator, getFieldValue }
        } = this.props;
        const { PreViewImageUrl, loading, typeTrue } = this.state;
        let { listenad: { targetType } } = this.props;
        targetType = targetType ? targetType : sortDetails ? sortDetails.targetType : '数据异常'

        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
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
                                    PreViewImageUrl && loading == false && typeTrue ?
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
                                })(
                                    <Input type="text" maxLength={20} placeholder="请输入..."></Input>
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
                                                type: 'listenad/update',
                                                payload: { targetType: value }
                                            })
                                            this.props.dispatch({
                                                type: 'listenad/update',
                                                payload: { targetPage: '' }
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
                                                        type: 'listenad/update',
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
                                                </Select> : targetType == 'LISTEN' || this.state.selectValue == 'LISTEN\'' ?
                                                    <Select ref="link2" value={targetPage} onChange={value => {
                                                        this.props.dispatch({
                                                            type: 'listenad/update',
                                                            payload: { targetPage: value }
                                                        })
                                                    }}>
                                                        {
                                                            customParams.map((item, index) => {
                                                                return <Option key={index} value={item.value}>
                                                                    {item.key}
                                                                </Option>
                                                            })
                                                        }
                                                    </Select> : ''
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
