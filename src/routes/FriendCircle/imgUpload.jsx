import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Upload } from 'antd';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from "@antv/data-set";
import { dict } from '../../utils/dict';
import styles from './imgUpload.less';
import moment from 'moment';
import { server } from '../../utils/utils';
import { xhr_upload } from '../../utils/xhr_upload'

export default class PieChart extends Component {

    constructor() {
        super();
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileType: 'image/jpeg',
            fileList: [
                // {
                //     uid: '-1',
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'http://kindergarten.ellabook.cn/b7688ae1b8304415b8e19caf3a5727c7.jpg',
                // },
            ],
        }
    }
    componentDidMount() {
        this.setState({
            fileList: this.props.defaultData
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultData.length == 0) {
            // console.log(11111111111111111)
            this.setState({
                fileList: nextProps.defaultData
            })
        }
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        // console.log(fileList.filter(item => item.percent != 0))
        this.props.onChange(fileList.filter(item => item.percent != 0));
        this.setState({ fileList: fileList.filter(item => item.percent != 0) });

    }

    render() {

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = this.props.listType == 'picture-card' ? (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{this.props.upLoadText}</div>
            </div>
        ) : <Button style={{ marginBottom: '5px' }} type='primary'>{this.props.upLoadText || ''}</Button>;
        // console.log(this.state.fileList)
        return (
            <div className={styles.imgUpLoad}>
                <div className="clearfix">
                    <Upload
                        accept={this.props.accept || ''}
                        name='file'
                        action={server.imgUploadUrl}
                        multiple={false}
                        data={{}}
                        mode={'cors'}
                        headers={{
                            "Content-Type": "multipart/form-data"
                        }}
                        withCredentials={true}
                        onSuccess={(res, file) => {
                            console.log(file)
                            this.setState({
                                fileList: [
                                    ...this.state.fileList,
                                    {
                                        uid: this.state.fileList.length + 1,
                                        name: file.name,
                                        url: res.data,
                                    }
                                ],
                                fileType: file.type
                            }, () => {
                                // console.log(this.state.fileList)
                                this.props.onChange(this.state.fileList);
                            })
                        }}
                        // beforeUpload={
                        //     (file) => {
                        //         let err = null;
                        //         if (err) props.beforeUpload ? props.beforeUpload('beforeUpload', err) : '';
                        //     }
                        // }
                        customRequest={({
                            action,
                            data,
                            file,
                            filename,
                            headers,
                            onError,
                            onProgress,
                            onSuccess,
                            withCredentials,
                        }) => {
                            const formData = new FormData();
                            // console.log(filename, file);
                            if (data) {
                                Object.keys(data).map(key => {
                                    formData.append(key, data[key]);
                                });
                            }
                            formData.append(filename, file);
                            // console.log(file);
                            xhr_upload(action, {
                                //   method: 'POST',
                                //   mode: 'cors',
                                //    formData,
                                'file': file
                            })
                                .then(res => {
                                    onSuccess(res);
                                })
                                .catch(err => {
                                    onError(err);
                                });

                            return {
                                abort() {
                                },
                            };
                        }}
                        listType={this.props.listType || 'text'}
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= this.props.maxNum ? null : uploadButton}

                    </Upload>
                    <Modal destroyOnClose={true} visible={previewVisible} footer={null} onCancel={this.handleCancel} style={{ textAlign: 'center' }}>
                        {
                            this.state.fileType.indexOf('image') != -1 && <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        }
                        {
                            this.state.fileType.indexOf('video') != -1 && <video src={previewImage} controls style={{ maxWidth: 300 }}></video>
                        }
                        {
                            this.state.fileType.indexOf('audio') != -1 && <audio src={previewImage} controls style={{ maxWidth: 300 }}></audio>
                        }
                    </Modal>
                </div>
            </div >
        )
    }
}
