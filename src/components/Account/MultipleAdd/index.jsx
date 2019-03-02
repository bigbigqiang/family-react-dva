import React, { PureComponent } from 'react';
import { Modal, Form, Input, Upload, Button, Icon, message } from 'antd';
import styles from './index.less';
import request from '../../../utils/request';
import { xhr_upload } from '../../../utils/xhr_upload';
import lodash from 'lodash';
let temp_file = null;

@Form.create()
export default class MultipleAdd extends PureComponent {

    state = {
        fileList: [],
        uploading: false
    }

    handleUpload = (url, meta) => {

        this.setState({
            uploading: true
        })

        xhr_upload(url, {
            ...meta,
            'file': this.state.fileList[0],
        }).then(res => {
            if (_.get(res, 'status') == '1') {
                // console.log(res)
                message.success(_.get(res, 'data'))
                this.setState({
                    fileList: [],
                    uploading: false
                })
                this.props.onSuccess(res)
            } else {
                // console.log(res)
                message.error('错误:' + _.get(res, 'message').toString())
            }
        })

    }

    render() {

        const { uploading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        /**
         * @param uploadUrl 文件上传地址
         * @param meta 随文件上传附带的其他信息
         */
        const {
            meta,
            uploadText,
            downloadText,
            uploadUrl,
            downloadUrl,
        } = this.props;

        const upload_props = {
            name: 'file',
            fileList: this.state.fileList,
            beforeUpload: (file) => {
                console.log(file)
                this.setState({
                    fileList: [file]
                });
                return false;
            },
        };

        return (
            <Modal
                visible={this.props.visible}
                loading={uploading}
                destroyOnClose={true}
                onOk={() => {
                    this.state.fileList[0] !== null && this.handleUpload(uploadUrl, meta)
                }}
                onCancel={() => {
                    this.props.onCancel();
                    this.setState({
                        fileList: [],
                        uploading: false
                    })
                }}
            >
                <Form className={styles.upload_form}>
                    {getFieldDecorator('file', {
                        rules: [{ required: true, message: '请选择批量导入Excel文件!' }],
                    })(
                        <Upload
                            {...upload_props}
                        >
                            <Button>
                                <Icon type="upload" /> {uploadText}
                            </Button>
                        </Upload>
                    )}
                    <br />
                    <a className="title" target='blank' href={downloadUrl}>{downloadText}</a>
                </Form>
            </Modal>
        )
    }
}
