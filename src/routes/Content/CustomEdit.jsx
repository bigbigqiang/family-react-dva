

import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Divider,
    Form,
    Button,
    Row,
    Col,
    Input,
    Upload,
    Switch,
    Icon,
    Select,
    message,
    Checkbox,
    Radio,
    Table,
    Popconfirm
} from 'antd';
import { Link } from 'dva/router';
import styles from './CustomEdit.less';
import { getParameter } from '../../utils/urlHandle';
import { xhr_upload } from '../../utils/xhr_upload';
import lodash from 'lodash';
import { AddBook } from '../../components/Banner'
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const columnIndexShowList = [{
    key: 'SLIDE_HORIZONTAL',
    value: '横向滑动'
}, {
    key: 'SLIDE_PORTRAIT',
    value: '纵向滑动'
}, {
    key: 'IMAGE_TEXT',
    value: '图文'
}];
const columnShowList = [{
    key: 'COVER',
    value: '图书封面'
}, {
    key: 'BRIEF',
    value: '图书简要'
}];

@connect(state => ({
    customedit: state.customedit,
}))

@Form.create()
export default class CustomEdit extends Component {
    state = {
        showAddBook: false,
        selectedRowKeys: [],
        bookList: [],
        page: 0,
        pageSize: 10
    };

    componentWillMount() {
        const columnCode = getParameter('columnCode');
        if (columnCode) {
            this.updateCustomColumn(columnCode)
        }
        else {
            this.props.dispatch({
                type: 'customedit/WillMount',
                payload: {}
            })
        }
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    handleOk = (selectedRowKeys, selectedRows) => {
        this.props.dispatch({
            type: 'customedit/listboth',
            payload: {
                newDataSource: selectedRows,
            },

        });
        this.props.dispatch({
            type: 'customedit/hidePlanModal'
        })
    };
    updateCustomColumn(columnCode) {
        this.props.dispatch({
            type: 'customedit/updateCustomColumn',
            payload: {
                columnCode: columnCode,
            }
        })
    }
    /*添加自定义栏目*/
    addCustomColumn = (bookCodeList) => {
        const columnCode = getParameter('columnCode');
        const { validateFields, setFields, getFieldValue } = this.props.form;
        validateFields((err, values) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            if (bookCodeList) {
                if (columnCode) {
                    values.columnCode = columnCode;
                    this.props.dispatch({
                        type: 'customedit/editCustomColumn',
                        payload: {
                            bookCodeList,
                            values
                        }
                    })
                } else {
                    this.props.dispatch({
                        type: 'customedit/addCustomColumn',
                        payload: {
                            bookCodeList,
                            values
                        }
                    })
                }
            }
            else {
                message.error('请添加图书!');
            }
        })
    }
    /*删除图书*/
    arrowDelete = (key) => {
        this.props.dispatch({
            type: 'customedit/arrowDeletes',
            payload: {
                key: key
            }
        })
    };
    /*上下移动*/
    arrowTop = (n) => {
        this.props.dispatch({
            type: 'customedit/arrowTop',
            payload: {
                n: n
            }
        })
    };
    arrowUp = (n) => {
        this.props.dispatch({
            type: 'customedit/arrowUp',
            payload: {
                n: n
            }
        })
    };
    arrowDown = (n) => {
        this.props.dispatch({
            type: 'customedit/arrowDown',
            payload: {
                n: n
            }
        })

    };
    /*清空列表*/
    DeleteList = () => {
        this.props.dispatch({
            type: 'customedit/DeleteList',
            payload: {
            }
        })
    };

    render() {
        const { getFieldDecorator, getFieldValue, validateFields, resetFields } = this.props.form;
        const { customedit: { columnDetails, customColumnBookListList, cusVisible, total } } = this.props;
        let bookCodeList = [];
        if (customColumnBookListList) {
            customColumnBookListList.map((item) => {
                bookCodeList.push(item.bookCode)
            })
        }
        bookCodeList = bookCodeList.toString();
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >

                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={this.DeleteList}>
                            清空列表
                        </Button>
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="primary"
                            onClick={() => {
                                this.props.dispatch({
                                    type: 'customedit/showPlanModal'
                                })
                                this.props.dispatch({
                                    type: 'customedit/columnQueryBookList',
                                    payload: {
                                        bookName: '',
                                        sendDate: '',
                                        publishCode: '',
                                        authorCode: '',
                                        gradeCode: '',
                                        domainFirstCode: '',
                                        domainSecondCode: '',
                                        pageIndex: '',
                                        pageSize: 10
                                    }
                                })
                            }}>
                            添加图书
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
                title: '图书ID',
                dataIndex: 'bookCode',
                key: 'bookCode'
            }, {
                title: '图书名称',
                dataIndex: 'bookName',
                key: 'bookName',
            }, {
                title: '适用年级',
                dataIndex: 'gradeName',
                align: 'center',
            }, {
                title: '位置操作',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => this.arrowUp(this.state.page * this.state.pageSize + index)} disabled={(this.state.page * this.state.pageSize + index) == 0}>
                                <Icon type="arrow-up" />
                            </Button>
                            <Button type="primary" onClick={() => this.arrowDown(this.state.page * this.state.pageSize + index)}
                                disabled={(this.state.page * this.state.pageSize + index) == customColumnBookListList.length - 1}>
                                <Icon type="arrow-down" />
                            </Button>
                            <Button type="primary" onClick={() => this.arrowTop(this.state.page * this.state.pageSize + index)} disabled={(this.state.page * this.state.pageSize + index) == 0}>
                                <Icon type="to-top" />
                            </Button>
                        </Button.Group>
                    )
                }
            }, {
                title: '其它操作',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Popconfirm title="确定删除吗?" onConfirm={() => {
                                this.arrowDelete(record)
                            }}>
                                <Button type="primary">
                                    <Icon type="delete" />删除
                                </Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        return (
            <div className={['clf']} style={{ minWidth: '858px' }}>
                <Row>
                    <Col>
                        <Link to="/content/customcolumn?type=back">
                            <Button><Icon type="left" />返回自定义栏目</Button>
                        </Link>
                    </Col>
                </Row>
                <div className={styles.option_container}>
                    <Form layout='inline' hideRequiredMark={true}>

                        <Row>
                            <FormItem label="栏目名称">
                                {getFieldDecorator('columnTitle', {
                                    initialValue: _.get(columnDetails, 'columnTitle'),
                                    rules: [{ required: true, message: '请输入栏目标题，字符限制30', type: 'string', max: 30 }],
                                })(
                                    <Input style={{ width: '200px' }}></Input>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="首页展示样式">
                                {getFieldDecorator('columnStyle', {
                                    initialValue: _.get(columnDetails, 'columnStyle', 'SLIDE_HORIZONTAL'),
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
                                    initialValue: _.get(columnDetails, 'listType', 'COVER'),
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
                                {getFieldDecorator('columnSourceNum', {
                                    initialValue: _.get(columnDetails, 'columnSourceNum', '') + '',
                                    rules: [{ required: true, message: '请输入首页展示数量', type: 'string' }],

                                })(
                                    <Input style={{ width: '200px' }}></Input>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="跳转链接文字">
                                {getFieldDecorator('targetDesc', {
                                    initialValue: _.get(columnDetails, 'targetDesc'),
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
                        <Divider />

                    </Form>
                </div>
                <Row>
                    {toolbar}
                </Row>
                <Row>
                    <Col>
                        <Table
                            rowKey="bookCode"
                            size="small"
                            columns={tableColumns}
                            dataSource={customColumnBookListList}
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
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={() => { this.addCustomColumn(bookCodeList) }}>保存</Button>
                </div>
                {cusVisible ? <AddBook
                    visible={cusVisible}
                    rowKey="bookCode"
                    handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)}
                /> : ''}
            </div>

        )
    }
}
