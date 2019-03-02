/**
 * 本页需要改动的内容有:
 * (1).service接口method的替换
 *      获取听单列表的接口替换到现在获取自定义栏目列表的接口,这个改动比较多
 * (2).modal接口相关put返回字段的修改,根据接口文档改动
 * (3).dict 字典相关改动
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Button, Select, Icon, Table, Modal, Popconfirm, message } from 'antd';
import { dict } from '../../utils/dict';
import styles from './ListenIndex.less';
import svgs from '../../assets/svgicons';
import moment from 'moment';
import ListenPreview from '../../components/ListenPreview';

const { Option } = Select;

@connect(state => ({
    listenindex: state.listenindex
}))
export default class ListenIndex extends Component {
    state = {
        visible: false,
        visible2: false
    }
    //打开对话框 type:1-书单 type:2-广告 type:3-预览
    openModal = (type) => {
        if (type == 1) {
            this.props.dispatch({
                type: 'listenindex/getCusList'
            }, this.setState({ visible: true }))
        }
        if (type == 2) {
            this.props.dispatch({
                type: 'listenindex/getADList'
            }, this.setState({ visible2: true }))
        }
        if (type == 3) {
            this.props.dispatch({
                type: 'listenindex/preview',
                payload: {
                    pcUid: ''
                }
            }, this.setState({ previewVisible: true }))
        }
    }
    //隐藏听单和广告的添加对话框
    handleCancel = () => {
        this.setState({ visible: false, visible2: false })
    }
    //排序
    handleSetOrder = (moudleCode, sequence) => {
        this.props.dispatch({
            type: 'listenindex/setOrder',
            payload: {
                moveCode: moudleCode,
                moveType: sequence
            }
        })
    }
    handleTopOrder = (moudleCode) => {
        this.props.dispatch({
            type: 'listenindex/topOrder',
            payload: {
                moudleCode: moudleCode

            }
        })
    }
    //删除模块
    handleDeleteModule = (moudleCode) => {
        this.props.dispatch({
            type: 'listenindex/deleteModule',
            payload: {
                moudleCode: moudleCode
            }
        })
    }
    //添加广告
    handleAddAd = () => {
        if (this.state.adTitle && this.state.adCode) {
            this.props.dispatch({
                type: 'listenindex/addAd',
                payload: {
                    lbAdCode: this.state.adCode
                }
            }, this.setState({ visible2: false, adTitle: null, adCode: null }))
        } else {
            message.error('请选择广告横幅!');
        }

    }
    //添加自定义栏目列表,要改为听单列表
    handleAddCus = () => {
        if (this.state.listenName && this.state.listenCode) {
            this.props.dispatch({
                type: 'listenindex/addCus',
                payload: {
                    listenCode: this.state.listenCode
                }
            }, this.setState({ visible: false, listenCode: null, listenCode: null }))
        } else {
            message.error('请选择听单!');
        }
    }
    //发布并更新列表
    handlePublish = () => {
        this.props.dispatch({
            type: 'listenindex/publish'
        })
    }
    //页面初始化,获取栏目列表
    componentDidMount() {
        this.props.dispatch({
            type: 'listenindex/getList'
        })
    }
    render() {
        const { visible, visible2, previewVisible } = this.state;
        const { listenindex: { moduleList, adList, cusList, previewData, publishTime, total } } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'moudleCode',
            },
            {
                title: '模块名称',
                dataIndex: 'moudleTitle',
            },
            {
                title: '模块类型',
                dataIndex: 'moudleType',
                render: (text) => {
                    return dict('LISTEN_' + text)
                }
            },
            {
                title: '发布状态',
                dataIndex: 'publishStatus',
                render: (text, record) => {
                    return dict('APPINDEX_' + text, {
                        type: 'badge'
                    })
                }
            },
            {
                title: '修改时间',
                dataIndex: 'publishDatetime',
                width: 90,
                render: (text) => {
                    return (
                        <span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>
                    )
                }
            },
            {
                title: '位置操作',
                width: 100,
                styles: { textAlign: 'Center' },
                render: (text, record) => {
                    if (!(record.moudleCode == "WKSORT99")) {
                        return (
                            <Button.Group>
                                <Button type="primary" disabled={record.first == true}
                                        onClick={() => this.handleSetOrder(record.moudleCode, 'UP')}>
                                    <Icon type="arrow-up" />
                                </Button>
                                <Button type="primary" disabled={record.last == true}
                                        onClick={() => this.handleSetOrder(record.moudleCode, 'DOWN')}>
                                    <Icon type="arrow-down" />
                                </Button>
                                <Button type="primary" disabled={record.first == true}
                                        onClick={() => this.handleTopOrder(record.moudleCode)}>
                                    <Icon type="to-top" />
                                </Button>
                            </Button.Group>

                        )
                    }
                }
            },
            {
                title: '其他操作',
                width: 145,
                styles: { textAlign: 'Center' },
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" disabled={record.moudleType == 'FREE'} onClick={() => {
                                let targetPath = dict(record.moudleType, {
                                    prefix: 'LISTEN',
                                    type: "link"
                                })
                                console.log(targetPath);
                                this.props.dispatch(routerRedux.push(targetPath))
                            }}>
                                <Icon type="edit" />编辑
                                </Button>
                            <Popconfirm
                                title="是否确认移除该模块？"
                                okText="确认"
                                onConfirm={() => this.handleDeleteModule(record.moudleCode)}>
                                <Button type="primary" disabled={record.moudleCode == "WKSORT99"}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group>)

                }
            }
        ].map(item => { item.align = 'center'; return item; })

        return (
            <div>
                <Row className={styles.search_line}>
                    <span className={styles.indexTitle}>听书首页<span className={styles.indexTitleDesc}>已发布{total}个模块</span></span>
                    <Button className={styles.marginLR5} type="primary" onClick={() => this.openModal(1)}>添加听单</Button>
                    <Button className={styles.marginLR5} type="primary" onClick={() => this.openModal(2)}>添加广告横幅</Button>
                </Row>
                <Row>
                    <Table
                        rowKey='id'
                        size="small"
                        bordered
                        columns={columns}
                        dataSource={moduleList}
                    ></Table>
                </Row>
                <Row style={{ textAlign: 'center' }}>
                    上次发布时间:{publishTime ? moment(publishTime).format('YYYY-MM-DD HH:mm:ss') : '无'}
                </Row>
                <Row style={{ textAlign: 'center' }}>
                    <Popconfirm
                        title={<div>发布成功后，所有设置将立即在听书首页生效。<br />是否确认发布？</div>}
                        okText="确认发布"
                        onConfirm={() => this.handlePublish()}>
                        <Button className={styles.marginLR5} type="primary">发布</Button>
                    </Popconfirm>
                    <Button className={styles.marginLR5} onClick={() => this.openModal(3)}>预览</Button>
                </Row>
                {visible ? <Modal
                    width={400}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleAddCus}
                    okText="确定添加">
                    <div>
                        <div className={styles.modalTitle}>
                            选择听单
                            <Select className={styles.select} onChange={(value) => {
                                let cus = _.find(cusList, item => { return item.listenCode == value; });
                                this.setState({
                                    listenCode: cus.listenCode,
                                    listenName: cus.listenName
                                })
                            }}>
                                {
                                    cusList ? cusList.map((item, index) => {
                                        return (<Option key={index} value={item.listenCode}>{item.listenName}</Option>)
                                    }) : []
                                }
                            </Select>
                        </div>
                    </div>
                </Modal> : ''}
                {visible2 ? <Modal
                    width={400}
                    visible={visible2}
                    onCancel={this.handleCancel}
                    onOk={this.handleAddAd}
                    okText="确定添加">
                    <div>
                        <div className={styles.modalTitle}>
                            选择广告横幅
                            <Select className={styles.select} onChange={(value) => {
                                let ad = _.find(adList, item => { return item.adCode == value; });
                                this.setState({
                                    adCode: ad.adCode,
                                    adTitle: ad.imageTitle
                                })
                            }}>
                                {
                                    adList ? adList.map((item) => {
                                        return (<Option key={item.adCode} value={item.adCode}>{item.imageTitle}</Option>)
                                    }) : []
                                }
                            </Select>
                        </div>
                    </div>
                </Modal> : ''}
                <Modal
                    className={styles.preview}
                    title="听书首页预览"
                    visible={previewVisible}
                    footer={[]}
                    onCancel={() => { this.setState({ previewVisible: false }) }}
                    destroyOnClose={true}
                >
                    <ListenPreview previewData={previewData}></ListenPreview>
                </Modal>
            </div>
        );
    }
}
