import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Row, Col, Select, Popconfirm, Table, Tabs, message } from 'antd';
import { xhr_upload } from '../../utils/xhr_upload';
import { server, captureVideoImage } from '../../utils/utils';
import { Link } from "dva/router";
import { dict } from '../../utils/dict';
import { cacheManager } from '../../utils/utils';
import styles from './EllaEditor.less';
// import { EllaImportor, EllaUploader } from '../../components/EllaUploader';
import ImgUpload from './imgUpload';
import moment from 'moment';
import CheckBook from '../../components/FriendCircel/Check';
import CheckAudio from '../../components/FriendCircel/CheckAudio';
const Option = Select.Option
import { TextTypeInfo, ImgTypeInfo, VideoTypeInfo, AudioTypeInfo, PublisherInfo } from './InformationType.jsx';
// import { message } from 'antd';
@connect(state => ({
    friendCircle: state.friendCircle
}))
export default class InformationDetail extends Component {

    constructor() {
        super();
        this.state = {
            activeKey: 'IMAGE',//1级idx 这个字段就是
            activeKey2nd: '1',//2级idx
            content: '',      //文本
            bookName: '',
            bookCode: '',
            videoUrl: '',
            videoImgUrl: '',

            audioCode: '', //音频编码
            audioUrl: '',
            pageNum: 1,
            pageSize: 10,
            imgList: '',
        }
    }

    componentDidMount() {
        this.getSendHistoryList();
    }
    getSendHistoryList(pageNum, pageSize) {
        this.setState({
            pageNum: pageNum || this.state.pageNum,
            pageSize: pageSize || this.state.pageSize,
        })
        this.props.dispatch({
            type: 'friendCircle/getSendHistoryList',
            payload: {
                pageNum: pageNum || this.state.pageNum,
                pageSize: pageSize || this.state.pageSize,
            }
        })
    }

    TabClick = (virtualActiveKey) => {
        const _this = this;
        if (this.state.activeKey == '5' || this.state.activeKey == virtualActiveKey) {
            this.setState({ activeKey: virtualActiveKey })
        } else {
            // this.setState({ visible: true, virtualActiveKey })
            function returnk(str) {
                if (str == 'VIDEO') {
                    return 'bookVideo'
                } else if (str == 'AUDIO') {
                    return 'bookAudio'
                }
                return '5'
            }
            Modal.confirm({
                title: '你想要切换发送内容吗?',
                content: '切换会删除当前内容!',
                cancelText: '取消',
                okText: '确定',
                onOk() {
                    _this.setState({
                        activeKey: virtualActiveKey,
                        // activeKey2nd: '5',
                        activeKey2nd: returnk(virtualActiveKey),
                    }, () => {
                        _this.clearInfo();
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    };
    TabClick2nd = (virtualActiveKey) => {
        const _this = this;
        if (this.state.activeKey2nd == '5' || this.state.activeKey2nd == virtualActiveKey) {
            this.setState({ activeKey2nd: virtualActiveKey })
        } else {
            // this.setState({ visible: true, virtualActiveKey })
            Modal.confirm({
                title: '你想要切换发送内容吗?',
                content: '切换会删除当前内容!',
                cancelText: '取消',
                okText: '确定',
                onOk() {
                    _this.setState({
                        activeKey2nd: virtualActiveKey
                    }, () => {
                        _this.clearInfo();
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    };
    sendInfo() {
        let data = {}
        if (this.state.activeKey == 'IMAGE') {
            data.imgList = this.state.imgList
        } else if (this.state.activeKey == 'VIDEO') {
            data.videoType = this.state.activeKey2nd;
            // data.bookCode = this.state.bookCode;
            data.videoUrl = this.state.videoUrl;
            data.videoImgUrl = this.state.videoImgUrl;
        } else if (this.state.activeKey == 'AUDIO') {
            data.audioCode = this.state.audioCode;
        }
        this.props.dispatch({
            type: 'friendCircle/sendInfo',
            payload: {
                publishUid: cacheManager.get('uid'),
                content: this.state.content,
                sendType: this.state.activeKey,
                bookCode: this.state.bookCode,
                ...data,
                //发送消息后回到第1页
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize,
            },
            callback: (res) => {
                // console.log(res);
                if (res == 1) {
                    this.clearInfo();
                }
            }
        });

    };

    clearInfo() {
        this.setState({
            // activeKey: 'IMAGE',//1级idx 这个字段就是
            // activeKey2nd: '5',//2级idx
            bookName: '',
            bookCode: '',
            content: '',      //文本
            videoUrl: '',

            audioUrl: '',
            audioCode: '', //音频编码
            // pageNum: 1,
            // pageSize: 10,
            imgList: '',
        })
    };
    clearVideo() {
        this.setState({
            videoUrl: ''
        })
    };
    clearAudio() {
        this.setState({
            audioUrl: '',
            audioCode: '',
            bookName: '',
            bookCode: '',
        });
    };
    render() {
        const { dispatch } = this.props;
        const { friendCircle } = this.props;
        const { sendHistoryListData, sendHistoryTotal, sendHistoryLoading } = friendCircle;
        const toolbar = (
            <div className={styles.tool_bar}>
                <Link to={'/friendCircle/information'}><Button type='primary' onClick={() => { }}>返回信息管理</Button></Link>
            </div>
        )
        const columns = [
            {
                title: '内容',
                dataIndex: 'a',
                key: 'a',
                align: 'center',
                width: 500,
                render: (text, record) => {
                    if (record.compositeType.indexOf('IMAGE') != -1) {
                        return <ImgTypeInfo content={record.content} bookName={record.bookName} imgNum={record.imgNum} imageList={record.imageList} />
                    } else if (record.compositeType.indexOf('VIDEO') != -1 || record.compositeType.indexOf('PREVIEW') != -1) {
                        return <VideoTypeInfo content={record.content} bookName={record.bookName} url={record.videoUrl || record.bookVideoPreviewUrl} />
                    } else if (record.compositeType.indexOf('AUDIO') != -1) {
                        return <AudioTypeInfo content={record.content} bookName={record.bookName} url={record.audioUrl} />
                    } else {
                        return <TextTypeInfo content={record.content} bookName={record.bookName} />
                    }
                }
            }, {
                title: '发送时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                align: 'center',
                width: 100,
                render: text => moment(text).format('YYYY-MM-DD')
            }, {
                title: '点赞数',
                dataIndex: 'praiseNum',
                key: 'praiseNum',
                align: 'center',
                width: 100,
            }, {
                title: '评论数',
                dataIndex: 'commentNum',
                key: 'commentNum',
                align: 'center',
                width: 100,
            }, {
                title: '操作',
                dataIndex: 'e',
                key: 'e',
                align: 'center',
                width: 150,
                render: (text, record) => {
                    return <div>
                        <Button.Group>
                            <Popconfirm
                                title="请确认是否删除!"
                                onConfirm={() => {
                                    dispatch({
                                        type: 'friendCircle/deleteInfo',
                                        payload: {
                                            dynamicId: record.id,
                                            uid: cacheManager.get('uid'),
                                            pageNum: this.state.pageNum,
                                            pageSize: this.state.pageSize,
                                        }
                                    })
                                }}
                                onCancel={() => { }}
                                okText="确定"
                                cancelText="取消">
                                <Button type="primary">
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="请确认是否置顶!"
                                onConfirm={() => {
                                    dispatch({
                                        type: `friendCircle/${record.isTop == 0 ? 'toTop' : 'cannelToTop'}`,
                                        payload: {
                                            dynamicId: record.id,
                                            pageNum: this.state.pageNum,
                                            pageSize: this.state.pageSize,
                                        }
                                    })
                                }}
                                onCancel={() => { }}
                                okText="确定"
                                cancelText="取消">
                                <Button type="primary">
                                    {record.isTop == 0 ? '置顶' : '取消置顶'}
                                    {record.isTop == 0 && <Icon type="to-top" />}
                                </Button>
                            </Popconfirm>
                        </Button.Group>
                    </div>
                }
            }
        ]
        return (
            <div className={styles.ellaEditor}>
                <div className={styles.editorBox}>
                    <div className={styles.clearInfo}>
                        <Popconfirm
                            placement="top"
                            title={'清除所有编辑内容吗?'}
                            onConfirm={() => {
                                this.clearInfo();
                            }} okText="确定" cancelText="取消">
                            <Button type="primary" shape="circle" icon="close" />
                        </Popconfirm>
                    </div>
                    <Input.TextArea
                        style={{ resize: 'none' }}
                        rows={4} value={this.state.content}
                        maxLength={1000}
                        onChange={(e) => {
                            this.setState({ content: e.target.value })
                        }} />
                    <Tabs
                        // defaultActiveKey="5"
                        activeKey={this.state.activeKey}
                        onTabClick={this.TabClick}>
                        <Tabs.TabPane tab={<span><Icon type="picture" />图片</span>} key="IMAGE">
                            <div className={styles.editorBox2nd}>
                                <Tabs
                                    onTabClick={() => { }}>
                                    <Tabs.TabPane tab={'图片'} key="1">
                                        <ImgUpload
                                            maxNum={9}
                                            upLoadText={'上传图片'}
                                            listType={'picture-card'}
                                            defaultData={
                                                this.state.imgList.split(',').filter(item => item).map((item, index) => ({ url: item, uid: index }))
                                            }
                                            accept={'.jpg,.jpeg,.png,.gif'}
                                            onChange={(data) => {
                                                console.log(data)
                                                this.setState({
                                                    imgList: data.map(item => item.url).join(','),
                                                })
                                            }}
                                        />

                                        <div style={{ width: 560, margin: '0 auto' }}>

                                            {/* <Button type='primary'>推荐动画书</Button> */}
                                            {
                                                // this.state.bookName ?
                                                //     <div className={styles.goToSee} style={{ color: '#999' }}>
                                                //         {`去看《${this.state.bookName}》`}
                                                //         < Icon
                                                //             style={{ cursor: 'pointer' }}
                                                //             type="close-circle"
                                                //             className={styles.goToSeeIcon}
                                                //             onClick={() => {
                                                //                 this.setState({
                                                //                     bookName: '',
                                                //                     bookCode: ''
                                                //                 })
                                                //             }} />
                                                //     </div>
                                                //     : <CheckBook
                                                //         text={'请选择推荐动画书'}
                                                //         onChange={(data) => {
                                                //             console.log(data)
                                                //             this.setState({
                                                //                 bookName: data[0].bookName,
                                                //                 bookCode: data[0].bookCode,
                                                //             })
                                                //         }} />
                                            }
                                        </div>
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="video-camera" />视频</span>} key="VIDEO">
                            <div className={styles.editorBox2nd}>
                                <Tabs
                                    activeKey={this.state.activeKey2nd}
                                    onTabClick={this.TabClick2nd}>
                                    <Tabs.TabPane tab={'动画书视频'} key="bookVideo">
                                        <div style={{ width: 560, margin: '0 auto' }}>
                                            {
                                                this.state.videoUrl ?
                                                    <div className={styles.goToSee} style={{ color: '#999' }}>
                                                        {/* <div style={{ width: 200, height: 300, backgroundColor: 'red' }}> */}
                                                        <div className={styles.close} onClick={() => { this.clearVideo(); }}><Icon type="close" /></div>
                                                        <video src={this.state.videoUrl} controls ></video>
                                                        {/* </div> */}
                                                        {`去看《${this.state.bookName}》`}
                                                        < Icon
                                                            style={{ cursor: 'pointer' }}
                                                            type="close-circle"
                                                            className={styles.goToSeeIcon}
                                                            onClick={() => {
                                                                this.setState({
                                                                    bookName: '',
                                                                    bookCode: '',
                                                                    videoUrl: '',
                                                                })
                                                            }} />
                                                    </div> :
                                                    <div style={{ position: 'relative', left: '-110px' }}>
                                                        <CheckBook
                                                            text={'请选择推荐动画书视频'}
                                                            onChange={(data) => {
                                                                console.log(data)
                                                                if (!data[0].bookVideoUrl) {
                                                                    message.warning('此动画书没有视频!');
                                                                    return;
                                                                }
                                                                // const file = this.getCover('http://book.ellabook.cn/book-preview-resource-video/B201808087300PV20180821AZGZD32786.mp4');
                                                                // console.log(file);
                                                                captureVideoImage({ link: data[0].bookVideoUrl, fileName: 'file.jpg', quality: 1 })
                                                                    .then(file => {
                                                                        console.log(file)
                                                                        xhr_upload(server.imgUploadUrl, {

                                                                            'file': file
                                                                        })
                                                                            .then(res => {
                                                                                // onSuccess(res);
                                                                                this.setState({
                                                                                    bookName: data[0].bookName,
                                                                                    bookCode: data[0].bookCode,
                                                                                    videoUrl: data[0].bookVideoUrl,
                                                                                    videoImgUrl: res.data
                                                                                })
                                                                                // console.log(res.data);
                                                                            })
                                                                            .catch(err => {
                                                                                onError(err);
                                                                            });

                                                                        // console.log(res)
                                                                    })
                                                                    .catch(err => {
                                                                        console.log(err)
                                                                        message.warning('出现视频跨域问题,封面无法传送,使用默认封面');
                                                                        this.setState({
                                                                            bookName: data[0].bookName,
                                                                            bookCode: data[0].bookCode,
                                                                            videoUrl: data[0].bookVideoUrl,
                                                                            videoImgUrl: 'http://kindergarten.ellabook.cn/f80787cc1e584b8485a999746a8fb7aa.png'
                                                                        })
                                                                    })

                                                            }} />
                                                    </div>
                                            }
                                        </div>
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={'本地视频'} key="localVideo">
                                        {
                                            this.state.videoUrl ?
                                                <div className={styles.goToSee}>
                                                    <div className={styles.close} onClick={() => { this.clearVideo(); }}><Icon type="close" /></div>
                                                    <video src={this.state.videoUrl} controls ></video>
                                                </div>
                                                : <ImgUpload
                                                    onChange={(data) => {
                                                        // console.log(data)
                                                        data[0] && captureVideoImage({ link: data[0].url, fileName: 'file.jpg', quality: 1 })
                                                            .then(file => {
                                                                console.log(file)
                                                                xhr_upload(server.imgUploadUrl, {

                                                                    'file': file
                                                                })
                                                                    .then(res => {
                                                                        console.log(res)
                                                                        this.setState({
                                                                            videoUrl: data[0].url,
                                                                            videoImgUrl: res.data
                                                                        })
                                                                        console.log(res.data);
                                                                    })
                                                                    .catch(err => {
                                                                        console.log(err);
                                                                    });

                                                                // console.log(res)
                                                            }).catch(err => {
                                                                message.warning('出现视频跨域问题,封面无法传送,使用默认封面')
                                                                this.setState({
                                                                    videoUrl: data[0].url,
                                                                    videoImgUrl: 'http://kindergarten.ellabook.cn/f80787cc1e584b8485a999746a8fb7aa.png'
                                                                })

                                                            })
                                                        // data[0] && this.setState({
                                                        //     videoUrl: data[0].url,
                                                        // })

                                                    }}
                                                    defaultData={this.state.videoUrl.split(',').filter(item => item).map((item, index) => ({ url: item, uid: index }))}
                                                    upLoadText={<span><Icon type="upload" />&nbsp;上传视频</span>}
                                                    maxNum={1}
                                                    accept={'.mp4'}
                                                />
                                        }

                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><Icon type="customer-service" />音频</span>} key="AUDIO">
                            <div className={styles.editorBox2nd}>
                                <Tabs
                                    activeKey={this.state.activeKey2nd}
                                    onTabClick={this.TabClick2nd}>
                                    <Tabs.TabPane tab={'音频'} key="bookAudio">
                                        {/* <ImgUpload
                                            defaultData={[]}
                                            onChange={(data) => {
                                                console.log(data)
                                            }}
                                            upLoadText={<span><Icon type="upload" />&nbsp;上传音频</span>}
                                            maxNum={1}
                                            accept={'.mp3'}
                                        /> */}
                                        {this.state.audioUrl ?
                                            <div className={styles.goToSee}>
                                                <div className={styles.close} onClick={() => { this.clearAudio(); }}><Icon type="close" /></div>
                                                <audio src={this.state.audioUrl} controls ></audio>
                                                {`去看《${this.state.bookName}》`}
                                                <Icon
                                                    style={{ cursor: 'pointer' }}
                                                    type="close-circle"
                                                    className={styles.goToSeeIcon}
                                                    onClick={() => { this.clearAudio(); }} />
                                            </div>
                                            : <CheckAudio
                                                text={'请选择推荐音频'}
                                                onChange={(data) => {
                                                    console.log(data);
                                                    this.setState({
                                                        audioCode: data[0].audioCode,
                                                        bookCode: data[0].bookCode,
                                                        bookName: data[0].bookName,
                                                        audioUrl: data[0].audioUrl,
                                                    })
                                                }}
                                            />}
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={'听单'} key="2" disabled>
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane disabled tab={<span><Icon type="link" />H5</span>} key="4">
                        </Tabs.TabPane>
                    </Tabs>
                    <div style={{ marginLeft: '10px' }}>
                        {
                            this.state.bookName ?
                                (this.state.activeKey2nd == 'bookVideo' || this.state.activeKey2nd == 'bookAudio' ? '' : <div className={styles.goToSee} style={{ color: '#999' }}>
                                    {`去看《${this.state.bookName}》`}
                                    < Icon
                                        style={{ cursor: 'pointer' }}
                                        type="close-circle"
                                        className={styles.goToSeeIcon}
                                        onClick={() => {
                                            this.setState({
                                                bookName: '',
                                                bookCode: ''
                                            })
                                        }} />
                                </div>)
                                : (this.state.activeKey2nd == 'bookVideo' || this.state.activeKey2nd == 'bookAudio' ? '' : <CheckBook
                                    text={'请选择推荐动画书'}
                                    onChange={(data) => {
                                        console.log(data)
                                        this.setState({
                                            bookName: data[0].bookName,
                                            bookCode: data[0].bookCode,
                                        })
                                    }} />)
                        }
                    </div>
                    <Popconfirm
                        placement="top"
                        title={'已经确认发送的内容了吗?'}
                        onConfirm={() => {
                            this.sendInfo();
                        }} okText="确定" cancelText="取消">
                        <Button type="primary" block={true} style={{ marginTop: 20, width: '100%' }}>发送</Button>
                    </Popconfirm>
                </div>
                <Table
                    rowKey={'id'}
                    bordered
                    // scroll={{ y: 850 }}
                    columns={columns}
                    dataSource={sendHistoryListData}
                    loading={sendHistoryLoading}
                    pagination={{
                        total: sendHistoryTotal,
                        showSizeChanger: true,
                        current: this.state.pageNum,
                        pageSize: this.state.pageSize,
                        onChange: (pageNum, pageSize) => {
                            this.getSendHistoryList(pageNum, pageSize);
                        },
                        onShowSizeChange: (pageNum, pageSize) => {
                            this.getSendHistoryList(pageNum, pageSize);
                        }
                    }}
                />
            </div>
        )
    }
}
