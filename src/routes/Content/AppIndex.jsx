import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Button, Select, Icon, Table, Modal, Popconfirm, message } from 'antd';
import { dict } from '../../utils/dict';
import styles from './AppIndex.less';
import svgs from '../../assets/svgicons.js';
import moment from 'moment';
import Preview from '../../components/Preview';

const { Option } = Select;

@connect(state => ({
    appindex: state.appindex
}))
export default class AppIndex extends Component {
    state = {
        visible: false,
        visible2: false
    }
    openModal = (type) => {
        if (type == 1) {
            this.props.dispatch({
                type: 'appindex/getCusList'
            }, this.setState({ visible: true }))
        }
        if (type == 2) {
            this.props.dispatch({
                type: 'appindex/getADList'
            }, this.setState({ visible2: true }))
        }
        if (type == 3) {
            this.props.dispatch({
                type: 'appindex/preview'
            }, this.setState({ previewVisible: true }))
        }
    }
    handleCancel = () => {
        this.setState({ visible: false, visible2: false })
    }
    handleSetOrder = (moudleCode, sequence) => {
        this.props.dispatch({
            type: 'appindex/setOrder',
            payload: {
                moudleCode: moudleCode,
                sequence: sequence
            }
        })
    }
    handleSetVisible = (moudleCode, visible) => {
        this.props.dispatch({
            type: 'appindex/setVisible',
            payload: {
                moudleCode: moudleCode,
                visible: visible
            }
        })
    }
    handleDeleteModule = (moudleCode) => {
        this.props.dispatch({
            type: 'appindex/deleteModule',
            payload: {
                moudleCode: moudleCode
            }
        })
    }
    handleAddAd = () => {
        if (this.state.adTitle && this.state.adCode) {
            this.props.dispatch({
                type: 'appindex/addAd',
                payload: {
                    moudleTitle: this.state.adTitle,
                    moudleCode: this.state.adCode
                }
            }, this.setState({ visible2: false, adTitle: null, adCode: null }))
        } else {
            message.error('请选择广告横幅!');
        }
    }
    handleAddCus = () => {
        if (this.state.customTitle && this.state.customCode) {
            this.props.dispatch({
                type: 'appindex/addCus',
                payload: {
                    moudleTitle: this.state.customTitle,
                    moudleCode: this.state.customCode
                }
            }, this.setState({ visible: false, customTitle: null, customCode: null }))
        } else {
            message.error('请选择自定义栏目!');
        }
    }
    handlePublish = () => {
        this.props.dispatch({
            type: 'appindex/publish'
        })
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'appindex/getList'
        })
    }
    render() {
        // const { } = this.props;
        const { visible, visible2, previewVisible } = this.state;
        const { appindex: { moduleList, adList, cusList, previewData, publishTime } } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'moudleCode',
            },
            {
                title: '模块管理',
                dataIndex: 'moudleTitle',
            },
            {
                title: '状态',
                dataIndex: 'publishStatus',
                render: (text, record) => {
                    return dict(text, {
                        prefix: 'APPINDEX',
                        type: 'badge'
                    })
                }
            },
            {
                title: '类型',
                dataIndex: 'moudleType',
                render: (text) => {
                    return dict(text, {
                        prefix: 'APPINDEX',
                        type: 'text'
                    })
                }
            },
            {
                title: '修改时间',
                dataIndex: 'updateDatetime',
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
                    if (!(record.moudleType == 'BANNER' || record.moudleType == 'WIKI')) {
                        return (
                            <Button.Group>
                                <Button type="primary" disabled={record.sortType == 'head'} onClick={() => this.handleSetOrder(record.moudleCode, 'forward')}>
                                    <Icon type="arrow-up" />
                                </Button>
                                <Button type="primary" disabled={record.sortType == 'tail'} onClick={() => this.handleSetOrder(record.moudleCode, 'back')}>
                                    <Icon type="arrow-down" />
                                </Button>
                                <Button type="primary" disabled={record.sortType == 'head'} onClick={() => this.handleSetOrder(record.moudleCode, 'top')}>
                                    <Icon type="to-top" />
                                </Button>
                            </Button.Group>
                        )
                    }
                }
            },
            {
                title: '其它操作',
                width: 215,
                styles: { textAlign: 'Center' },
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" disabled={record.moudleType == 'FREE'} onClick={() => {
                                let targetPath = dict(record.moudleType, {
                                    prefix: 'APPINDEX',
                                    type: "link"
                                })
                                this.props.dispatch(routerRedux.push(targetPath))
                            }}>
                                <Icon type="edit" />编辑
                            </Button>
                            <Popconfirm
                                title="是否确认移除该模块？"
                                okText="确认"
                                onConfirm={() => this.handleDeleteModule(record.moudleCode)}>
                                {/* <Button type="primary" disabled={record.moudleType == 'BANNER' || record.moudleType == 'WIKI' || record.moudleType == 'FREE' || record.moudleType == 'SUBJECT'}> */}
                                <Button type="primary" disabled={['BANNER', 'WIKI', 'FREE', 'SUBJECT'].indexOf(record.moudleType) !== -1}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                            <Button disabled={!(record.moudleType == 'FREE' || record.moudleType == 'SUBJECT')} type={record.visible === "YES" ? "primary" : "default"} onClick={() => this.handleSetVisible(record.moudleCode, record.visible === "YES" ? "NO" : "YES")} >
                                <Icon type="eye" />{record.visible === "YES" ? "可见" : "不可见"}
                            </Button>
                        </Button.Group>
                    )
                }
            }
        ].map(item => { item.align = 'center'; return item; })

        return (
            <div>
                <Row className={styles.search_line}>
                    展示到首页:
                    <Button className={styles.marginLR5} type="primary" onClick={() => this.openModal(1)}>添加自定义栏目</Button>
                    <Button className={styles.marginLR5} type="primary" onClick={() => this.openModal(2)}>添加广告横幅</Button>
                </Row>
                <Row>
                    <Table
                        rowKey='moudleCode'
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
                        title={<div>发布成功后，所有设置将立即在APP中生效。<br />是否确认发布？</div>}
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
                            选择一个栏目
                            <Select className={styles.select} onChange={(value) => {
                                let cus = _.find(cusList, item => { return item.customCode == value; });
                                this.setState({
                                    customCode: cus.customCode,
                                    customTitle: cus.customTitle
                                })
                            }}>
                                {
                                    cusList ? cusList.map((item, index) => {
                                        return (<Option key={index} value={item.customCode}>{item.customTitle}</Option>)
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
                    title="APP首页预览"
                    visible={previewVisible}
                    footer={[]}
                    onCancel={() => { this.setState({ previewVisible: false }) }}
                    destroyOnClose={true}
                >
                    <Preview previewData={previewData}></Preview>
                </Modal>
            </div>
        );
    }
}
