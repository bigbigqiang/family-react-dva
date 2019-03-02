/**
 * 主要改动参考ListenIndex 首页前面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Icon, Table, Popconfirm } from 'antd';
import { dict } from '../../utils/dict';
import styles from './ListenAD.less';
import AddListenAD from '../../components/AddListenAD';
import moment from 'moment';

@connect(state => ({
    listenad: state.listenad
}))
export default class ListenAD extends Component {

    state = {
    }

    getAdList(status) {
        this.props.dispatch({
            type: 'listenad/getAdList',
            payload: {
                status: status
            }
        })
    }

    deleteAdList(adCode) {
        this.props.dispatch({
            type: 'listenad/deleteAdList',
            payload: {
                adCode: adCode,
                pcUid: localStorage.getItem('ellahome_token')
            }
        })
    }

    handleEditAd = (id) => {
        this.props.dispatch({
            type: 'listenad/getAdDetails',
            payload: {
                id: id
            }
        })
    }
    handleEditAdOn = () => {
        this.props.dispatch({
            type: 'listenad/handleEditAdOn',
            payload: {

            }
        })
    }

    componentDidMount() {

        this.getAdList('');

    }

    render() {
        const { listenad: { getAdLists } } = this.props;
        const columns = [
            {
                title: '图片标题 ',
                dataIndex: 'imageTitle'
            }, {
                title: '修改时间',
                width: 95,
                dataIndex: 'updateTime',
                render: (text, record) => {
                    if (record.updateTime) {
                        let result = new Date(record.updateTime);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                }
            }, {
                title: '目标类型',
                dataIndex: 'targetType',
                key: 'targetType',
                width: 90,
                render: (text) => {
                    return dict('AD_' + text)
                }
            }, {
                title: '目标链接',
                dataIndex: 'imageDesc'

            }, {
                title: '状态',
                dataIndex: 'showStatus',
                key: 'showStatus',
                width: 90,
                render: (text) => {
                    return dict('AD_' + text, {
                        type: 'badge'
                    })
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                render: (text, record) => {
                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button type="primary"
                                onClick={() => {
                                    this.setState({
                                        visible: true,
                                        modalData: record
                                    })
                                    this.handleEditAd(record.id)
                                }} disabled={record.sortType == 'head'}>
                                <Icon type="form" />编辑
                                </Button>
                            <Popconfirm title="是否确定要删除该横幅?" onConfirm={() => {
                                this.deleteAdList(record.adCode);
                            }}>
                                <Button type="primary"
                                    disabled={record.showStatus == 'YES'}>
                                    <Icon type="delete" theme="outlined" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group >

                    )
                }
            }
        ].map(item => { item.align = 'center'; return item; })

        const searchDom = (
            <Form layout='inline'>
                <Row className={styles.search_line}>
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={() => { this.handleEditAdOn() }}>
                            <Icon type="plus-circle-o" />新建广告横幅
                        </Button>
                    </Col>
                </Row>
            </Form>
        )

        return (
            <div>
                {searchDom}
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            columns={columns}
                            dataSource={getAdLists}
                            bordered
                            pagination={{
                                size: "small",
                                showSizeChanger: true,
                                showQuickJumper: true,
                                hideOnSinglePage: true,
                            }}
                        ></Table>
                    </Col>
                </Row>
                <AddListenAD></AddListenAD>
            </div >
        )
    }
}
