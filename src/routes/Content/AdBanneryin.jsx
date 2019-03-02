import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Select, Icon, Table, Popconfirm, Modal, Upload, Input, message } from 'antd';
import { dict } from '../../utils/dict';
import styles from './AdBanneryin.less';
import { AddAd } from '../../components/Banner';
import moment from 'moment';
@connect(state => ({
    adbanner: state.adbanner
}))


export default class AdBanner extends Component {
    state = {
    }
    getAdList(args) {
        this.props.dispatch({
            type: 'adbanner/getAdList',
            payload: {
                ...args
            }
        })
    }
    deleteAdList(adCode) {
        this.props.dispatch({
            type: 'adbanner/deleteAdList',
            payload: {
                adCode: adCode

            }
        })
    }
    handleEditAd = (adCode) => {
        this.props.dispatch({
            type: 'adbanner/getAdDetails',
            payload: {
                adCode: adCode
            }
        })
    }

    componentDidMount() {
        this.getAdList()
    }

    render() {

        const {
            adbanner: {
                getAdLists,
            }
        } = this.props;

        const columns = [
            {
                title: '图片标题 ',
                dataIndex: 'imageTitle',
            }, {
                title: '修改时间',
                align: 'center',
                dataIndex: 'updateTime',
                render: (text, record, index) => {
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
                },
            }, {
                title: '目标类型',
                align: 'center',
                dataIndex: 'targetType',
                render: (text, record, index) => {
                    return dict('AD_' + text)
                }
            }, {
                title: '目标链接',
                align: 'center',
                dataIndex: 'targetPageDesc',
            }, {
                title: '状态',
                align: 'center',
                dataIndex: 'status',
                width: 85,
                render: (text, record, index) => {
                    return dict('AD_' + text, {
                        type: 'badge'
                    })
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Button.Group className={styles.rowButton}>
                            <Button type="primary"
                                onClick={() => {
                                    this.setState({
                                        visible: true,
                                        modalData: record
                                    })
                                    this.handleEditAd(record.adCode)
                                }} disabled={record.sortType == 'head'}>
                                <Icon type="form" />编辑
                                </Button>


                            <Popconfirm title="是否确定要删除该横幅?" onConfirm={() => {
                                this.deleteAdList(record.adCode);

                            }}>
                                <Button type="primary"
                                    disabled={record.status == 'SHOW_ON'}>
                                    <Icon type="delete" theme="outlined" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group >

                    )
                }
            }
        ]

        const searchDom = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col>
                        <Input.Search
                            onSearch={(value) => {
                                this.setState({
                                    search: value
                                })
                                console.log(value)
                                this.getAdList({
                                    adTitle: value
                                })
                            }}
                            enterButton
                        />
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={() => {

                            this.handleEditAd('')
                        }}
                        >
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
                <AddAd></AddAd>
            </div >
        )
    }
}
