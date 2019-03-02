
import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Form,
    Button,
    Row,
    Col,
    Input,
    Icon,
    Select,
    message,
    Radio,
    Table,
    Popconfirm
} from 'antd';
import { Link } from 'dva/router';
import { Layout } from 'antd';
import styles from './ListenEdit.less';
import { getParameter } from '../../utils/urlHandle';
import { sec_to_time } from '../../utils/formata_se.js';
import AddListenList from '../../components/AddListenList';
const FormItem = Form.Item;
const Option = Select.Option;
const { Sider, Content } = Layout;
const columnIndexShowList = [{
    key: 'HORIZONTAL_NO_SUBTITLE',
    value: '横排无音频副标题'
}, {
    key: 'PORTRAIT_WITH_SUBTITLE',
    value: '竖排有音标副标题'
}];
const columnShowList = [{
    key: 'HORIZONTAL_NO_SUBTITLE',
    value: '横排无音频副标题'
}, {
    key: 'PORTRAIT_WITH_SUBTITLE',
    value: '竖排有音标副标题'
}];

@connect(state => ({
    listenedit: state.listenedit,
}))

@Form.create()
export default class ListenEdit extends Component {
    state = {
        selectedRowKeys: [],
        page: 0,
        pageSize: 10
    };

    componentWillMount() {
        const listenCode = getParameter('listenCode');
        if (listenCode) {
            this.updateCustomColumn(listenCode)
        }
        else {
            this.props.dispatch({
                type: 'listenedit/WillMount',
                payload: {}
            })
        }
    }
    /*获取音频列表*/
    getListenList(addTime, classCode, publishCode, authorCode, audioName, pageIndex, pageSize) {
        this.props.dispatch({
            type: 'listenedit/getListenList',
            payload: {
                addTime: addTime,
                classCode: classCode,
                publishCode: publishCode,
                authorCode: authorCode,
                audioName: audioName,
                pageNum: pageIndex,
                pageSize: pageSize
            }
        })


    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    handleOk = (selectedRowKeys, selectedRows) => {
        this.props.dispatch({
            type: 'listenedit/listBoth',
            payload: {
                newDataSource: selectedRows,
            },
        });

    };
    updateCustomColumn(listenCode) {
        this.props.dispatch({
            type: 'listenedit/queryByLbListenCode',
            payload: {
                lbListenCode: listenCode,
            }
        })
    }

    /*添加听单*/
    addCustomColumn = (audioCodeList, voiceTotalTime) => {
        const listenCode = getParameter('listenCode');
        const { validateFields, setFields, getFieldValue } = this.props.form;
        validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            if (audioCodeList) {
                this.props.dispatch({
                    type: 'listenedit/editLbList',
                    payload: {
                        listenCode: listenCode,
                        listenName: values.listenName,
                        voiceTotalTime: voiceTotalTime,
                        columnStyle: values.columnStyle,
                        listType: values.listType,
                        jumpDesc: values.jumpDesc,
                        homeShowNum: values.homeShowNum,
                        audioList: audioCodeList

                    }
                })
            } else {
                message.error('请添加图书!');
            }
        })
    }
    /*删除图书*/
    arrowDelete = (key) => {
        this.props.dispatch({
            type: 'listenedit/arrowDeletes',
            payload: {
                key: key
            }
        })
    };
    /*上下移动*/
    arrowUp = (n) => {
        this.props.dispatch({
            type: 'listenedit/arrowUp',
            payload: {
                n: n
            }
        })
    };
    arrowDown = (n) => {
        this.props.dispatch({
            type: 'listenedit/arrowDown',
            payload: {
                n: n
            }
        })

    };
    arrowTop = (n) => {
        this.props.dispatch({
            type: 'listenedit/arrowTop',
            payload: {
                n: n
            }
        })
    }
    /*清空列表*/
    DeleteList = () => {
        this.props.dispatch({
            type: 'listenedit/DeleteList',
            payload: {
            }
        })
    };

    render() {
        const { getFieldDecorator, getFieldValue, validateFields, resetFields } = this.props.form;
        const { listenedit: { lbListenList, lbListenDetail, cusVisible } } = this.props;
        let listenCodeList = [];
        let total = 0;
        let voiceTotalTime = 0;
        if (lbListenList) {
            total += lbListenList.length;
            lbListenList.map((item) => {
                listenCodeList.push(item.audioCode);
                voiceTotalTime += item.audioTimeLength
            })
        }

        listenCodeList = listenCodeList.toString();
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >

                    <Col className={styles.rightButton}>
                        <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={() => {
                            this.addCustomColumn(listenCodeList, voiceTotalTime)
                        }}>保存为听单</Button>
                    </Col>

                    <Col className={styles.rightButton}>

                        <Button type="primary"
                            onClick={() => { this.getListenList('') }}>
                            <Icon type="plus-circle-o" /> 添加音频内容
                        </Button>
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="default" onClick={this.DeleteList}>
                            清空列表
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
        const tableColumns = [
            {
                title: '序号',
                dataIndex: 'id',
                align: 'center',
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <div>
                            {index + 1}
                        </div>
                    )
                }
            }, {
                title: '音频名称',
                dataIndex: 'audioName',
                align: 'center',
                key: 'audioName'

            }, {
                title: '音频时长',
                dataIndex: 'audioTimeLength',
                key: 'audioTimeLength',
                align: 'center',
                render(text) {
                    return sec_to_time(text)
                }

            }, {
                title: '对应动画书',
                dataIndex: 'bookName',
                align: 'center',
                key: 'bookName'

            }, {
                title: '位置操作',
                width: 100,
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary" disabled={(this.state.page * this.state.pageSize + index) == 0}
                                onClick={() => this.arrowUp(this.state.page * this.state.pageSize + index)}>
                                <Icon type="arrow-up" />
                            </Button>
                            <Button type="primary"
                                disabled={(this.state.page * this.state.pageSize + index) == lbListenList.length - 1}
                                onClick={() => this.arrowDown(this.state.page * this.state.pageSize + index)}>
                                <Icon type="arrow-down" />
                            </Button>
                            <Button type="primary" disabled={(this.state.page * this.state.pageSize + index) == 0}
                                onClick={() => this.arrowTop(this.state.page * this.state.pageSize + index)}>
                                <Icon type="to-top" />
                            </Button>
                        </Button.Group>
                    )
                }

            },
            {
                title: '其他操作',
                dataIndex: 'operation',
                align: 'center',
                key: 'operation',
                className: styles.operation,
                render: (text, record, index) => {
                    return (
                        <Popconfirm title="确定删除吗?" onConfirm={() => {
                            this.arrowDelete(record)
                        }}>
                            <Button type="primary">
                                <Icon type="delete" theme="outlined" />删除
                                    </Button>
                        </Popconfirm>
                    )
                }
            }
        ]

        return (

            <div className={['clf']} style={{ minWidth: '858px' }}>

                <Row>
                    <Col>
                        <Link to="/listen/listenlist?type=back">
                            <Button><Icon type="left" />返回听单管理列表</Button>
                        </Link>
                    </Col>
                </Row>
                <Layout style={{ background: 'white' }}>
                    <Sider style={{ background: 'white', marginRight: '40px' }}>
                        <Row className={styles.settingStyle}>设置听单展示样式</Row>
                        <Form layout='inline' hideRequiredMark={true}>
                            <Row>
                                <FormItem label="栏目名称">
                                    {getFieldDecorator('listenName', {
                                        initialValue: _.get(lbListenDetail, 'listenName'),
                                        rules: [{ required: true, message: '请输入栏目标题，字符限制30', type: 'string', max: 30 }],
                                    })(
                                        <Input style={{ width: '200px' }}></Input>
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="栏目排版样式">
                                    {getFieldDecorator('columnStyle', {
                                        initialValue: _.get(lbListenDetail, 'columnStyle', 'HORIZONTAL_NO_SUBTITLE'),
                                    })(
                                        <Select style={{ width: '200px' }} onChange={this.handleChange}>
                                            {columnIndexShowList.map(province => <Option
                                                key={province.key}>{province.value}</Option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="列表展示样式">
                                    {getFieldDecorator('listType', {
                                        initialValue: _.get(lbListenDetail, 'listType', 'HORIZONTAL_NO_SUBTITLE'),
                                    })(
                                        <Select style={{ width: '200px' }} onChange={this.handleChange}>
                                            {columnShowList.map(province => <Option
                                                key={province.key}>{province.value}</Option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </Row>

                            <Row>
                                <FormItem label="首页展示数量">
                                    {getFieldDecorator('homeShowNum', {
                                        initialValue: _.get(lbListenDetail, 'homeShowNum', '') + '',
                                        rules: [{ required: true, message: '请输入首页展示数量', type: 'string' }],

                                    })(
                                        <Input style={{ width: '200px' }}></Input>
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="跳转链接文字">
                                    {getFieldDecorator('jumpDesc', {
                                        initialValue: _.get(lbListenDetail, 'jumpDesc'),
                                        rules: [{ required: true, message: '请输入链接文字，字符限制30', type: 'string', max: 30 }],
                                    })(
                                        <Input style={{ width: '200px' }}></Input>
                                    )}
                                </FormItem>
                            </Row>

                            <Row>
                                <FormItem label="链接目标">
                                    <Radio defaultChecked={true}>跳转到当前列表</Radio>
                                </FormItem>
                            </Row>


                        </Form>
                    </Sider>
                    <Layout>
                        <Content style={{ background: 'white' }}>
                            <Row className={styles.settingStyle}>配置听单列表</Row>
                            <Row span={4} style={{ textAlign: 'right' }} >
                                {total}个内容，总时长：{sec_to_time(voiceTotalTime)}
                            </Row>
                            <Row>
                                {toolbar}
                            </Row>


                            <Row>
                                <Col>
                                    <Table
                                        rowKey="audioCode"
                                        size="small"
                                        bordered
                                        columns={tableColumns}
                                        dataSource={lbListenList}
                                        pagination={{
                                            size: "small",
                                            onChange: (page, pageSize) => {
                                                this.setState({ page: page - 1, pageSize })
                                            },
                                            onShowSizeChange: (page, pageSize) => {
                                                this.getRoles({ page: page - 1, pageSize })
                                            }

                                        }}
                                    />
                                </Col>
                            </Row>

                        </Content>

                    </Layout>

                </Layout>

                {cusVisible ? <AddListenList
                    visible={cusVisible}
                    rowKey="audioCode"
                    handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)}
                    searchListenList={(addTime, classCode, publishCode, authorCode, audioName, pageIndex, pageSize) => this.getListenList(addTime, classCode, publishCode, authorCode, audioName, pageIndex, pageSize)}
                /> : ''}
            </div>

        )
    }
}
