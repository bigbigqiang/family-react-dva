import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message, Modal, Checkbox, Tooltip, Popconfirm, Layout, DatePicker, Spin } from 'antd';
import moment from 'moment';
import styles from './index.less'
import { connect } from 'dva';
import { sec_to_time } from '../../utils/formata_se';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const { Header, Content, Sider, Footer } = Layout;
@connect(state => ({
    listenedit: state.listenedit,
}))
export default class AddListenList extends Component {
    state = {
        pageIndex: 1,
        pageSize: 10,
        searchText: '',
        loading: false,
        total: '',
        firstValue: true,
        showQuickJumper: false,
        currentPage: 0,
        searchValue: '',
        checkedData: [],
        publishList: [],
        goodsPriceList: [],
        authorList: [],
        stateList: [],
        createBeginTime: '',
        selectedRowKeys: [],
        selectedRows: [],
        createEndTime: '',
        modal: {
            modalData: [],
            modalVisible: false,
            pageIndex: 1,
            pageSize: 10
        },
        classCode: '',
        publishCode: '',
        audioName: '',
        authorCode: '',
        addTime: '',
        totalTime: 0,
        allselectsData: [],
        allselectskey: []
    }
    componentDidMount() {
        // this.bookResultItem();
        // this.bookListFn(this.state.book.bookName, this.state.createBeginTime,this.state.book.publishCode,this.state.bookAuthorRelation.authorCode, this.state.goods.gradeCode,this.state.firstBookDomainRelation.domainFirstCode,this.state.bookDomainRelation.domainSecondCode,'',5);

    }
    handleOk = () => {
        this.props.handleOk(this.state.allselectskey, this.state.allselectsData);
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            allselectskey: [],
            allselectsData: [],
            createBeginTime: ''
        });
        this.clearSelect()

    }
    onCancel = () => {
        this.props.dispatch({
            type: 'listenedit/update',
            payload: {
                cusVisible: false
            }
        })
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            allselectskey: [],
            allselectsData: [],
            createBeginTime: ''

        })
        this.clearSelect()
    }


    getInputValue = (value) => {
        this.setState({
            audioName: value
        })
    }
    fetchSearchBook(text) {
        this.setState({
            audioName: text
        })
        this.props.searchListenList(this.state.addTime, this.state.classCode, this.state.publishCode, this.state.authorCode, this.state.audioName, 1, this.state.pageSize)
    }

    bookPublishChange(str, value) {
        this.setState({
            publishCode: value
        })

    }
    bookAuthorChange(str, value) {
        this.setState({
            authorCode: value
        })
    }
    bookSecondChange(str, value) {
        this.setState({
            classCode: value,
            firstValue: true
        })
    }
    createBeginTime(value, dateString, str) {
        this.setState({
            addTime: dateString
        })
    }
    clearSelect() {
        this.setState({
            classCode: '',
            publishCode: '',
            audioName: '',
            authorCode: '',
            addTime: ''
        })
    }
    query(page) {
        this.props.searchListenList(this.state.addTime,this.state.classCode,this.state.publishCode,this.state.authorCode,this.state.audioName,page,this.state.pageSize)
    }
    render() {
        const { loading, modal, pageSize, selectedRowKeys, selectedRows } = this.state;
        const { visible, rowKey } = this.props;
        const { listenedit: { publishList, originalAuthorList, audioList, bookPictureClassList, listLoading, cusVisible } } = this.props;
        let prunePubList = [];
        publishList.map(item => {
            if (item) {
                prunePubList.push(item)
            }
        })
        const columns = [
            {
                title: '音频名称',
                width: 150,
                align: 'center',
                dataIndex: 'audioName',
                key: 'audioName'

            }, {
                title: '音频时长',
                width: 100,
                align: 'center',
                dataIndex: 'audioTimeLength',
                key: 'audioTimeLength',
                render(text) {
                    return sec_to_time(text)
                }


            }, {
                title: '对应动画书',
                dataIndex: 'bookName',
                align: 'center',
                width: 125,
                key: 'bookName'
            }, {
                title: '音频上架时间',
                dataIndex: 'createTime',
                align: 'center',
                width: 125,
                key: 'createTime',
                render: (text, record, index) => {
                    if (record.createTime) {
                        let result = new Date(record.createTime);
                        return (
                            <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD HH:mm:ss')}</span>
                        )
                    } else {
                        return (
                            <span>异常时间</span>
                        )
                    }
                },
            }

        ]
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            },
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                let curKays = this.state.allselectskey;
                let curdata = this.state.allselectsData;
                let totalTime = this.state.totalTime;
                if (selected == true) {
                    curKays.push(record[this.props.rowKey]);
                    curdata.push(record);
                    totalTime += record.audioTimeLength

                } else {
                    let _this = this;
                    curKays.forEach(function (item, index) {
                        if (item == record[_this.props.rowKey]) {
                            curKays.splice(index, 1)
                        }
                    });
                    curdata.forEach(function (item, index) {
                        if (item[_this.props.rowKey] == record[_this.props.rowKey]) {
                            curdata.splice(index, 1)
                            totalTime -= item.audioTimeLength
                        }

                    });


                }

                this.setState({
                    allselectskey: curKays,
                    allselectsData: curdata,
                    totalTime: totalTime
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                let curKays = this.state.allselectskey;
                let curdata = this.state.allselectsData;
                let totalTime = this.state.totalTime;
                if (selected == true) {
                    for (var i = 0; i < changeRows.length; i++) {
                        curKays.push(changeRows[i][this.props.rowKey]);
                        totalTime += changeRows[i].audioTimeLength
                    }
                    curdata.push(...changeRows);

                } else {
                    totalTime = 0;
                    for (var i = 0; i < curKays.length; i++) {
                        var index = i;
                        for (var j = 0; j < changeRows.length; j++) {
                            if (curKays[index] == changeRows[j][this.props.rowKey]) {
                                curKays.splice(index, 1)
                                i--;
                                break;
                            }
                        }
                    }
                    for (var i = 0; i < curdata.length; i++) {
                        for (var j = 0; j < changeRows.length; j++) {
                            if (curdata[i][this.props.rowKey] == changeRows[j][this.props.rowKey]) {
                                curdata.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                }

                this.setState({
                    allselectskey: curKays,
                    allselectsData: curdata,
                    totalTime: totalTime
                }, () => {

                }
                )
            }
        }
        return (
            <Modal
                className={styles.addModal}
                visible={cusVisible}
                title="添加音频列表"
                onCancel={this.onCancel}
                onOk={this.handleOk}
                footer={null}
            >
                <Layout>
                    <Sider width={190} style={{ background: '#fff' }}>
                        <Row style={{ marginBottom: 0 }} align='middle'>
                            <span className={styles.sTxt}>搜索音频</span>
                            <Col>
                                <Search placeholder="搜索" enterButton onBlur={(e) => { this.getInputValue(e.target.value) }} onPressEnter={(e) => { this.fetchSearchBook(e.target.value, 0) }} onSearch={() => { this.fetchSearchBook(this.state.audioName) }} />
                            </Col>
                        </Row>
                        <div className={styles.slideAll}>
                            <span className={styles.sTxt}>精确检索</span>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>类别</span>
                            <Select value={this.state.classCode} className={styles.slideRight} style={{ width: 113 }} onChange={(value) => this.bookSecondChange("bookSecondClassList", value)}>
                                <Option value=''>全部</Option>
                                {
                                    bookPictureClassList ? bookPictureClassList.map(function (item, index) {
                                        return <Option key={index} value={item.classCode}>{item.className}</Option>
                                    }) : []
                                }
                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>上架时间</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(value, dateString) => { this.createBeginTime(value, dateString, "createBeginTime") }}
                                value={this.state.createBeginTime != '' ? moment(this.state.createBeginTime, 'YYYY-MM-DD') : null}
                                className={styles.slideRight}
                            />


                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>出版社</span>
                            <Select className={styles.slideRight} value={this.state.publishCode} style={{ width: 113 }} onChange={(value) => this.bookPublishChange("bookPublish", value)} >
                                <Option value=''>全部</Option>
                                {
                                    prunePubList ? prunePubList.map(function (item, index) {
                                        return <Option key={index} value={item.uid}>{item.publishName}</Option>
                                    }) : []
                                }
                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>作者</span>
                            <Select className={styles.slideRight} value={this.state.authorCode} style={{ width: 113 }} onChange={(value) => this.bookAuthorChange("bookPublish", value)}>
                                <Option value=''>全部</Option>
                                {
                                    originalAuthorList ? originalAuthorList.map(function (item, index) {
                                        return <Option key={index} value={item.authorCode}>{item.authorName}</Option>
                                    }) : []
                                }
                            </Select>
                        </div>



                        <div className={styles.mselect} ><Button onClick={() => this.clearSelect()} >恢复默认</Button></div>
                        <div className={styles.mselect}><Button onClick={() => this.props.searchListenList(this.state.addTime, this.state.classCode, this.state.publishCode, this.state.authorCode, '', '', this.state.pageSize)} type="primary">查询</Button></div>

                    </Sider>
                    <Layout>
                        <Content style={{ background: '#fff', margin: 0, minHeight: 408 }}>

                            <div id="addNewBook" style={{ padding: "0px 0 0 20px", "position": "relative" }}>
                                <Row className={styles.search_line}>
                                    <Col span={16} style={{ marginTop: 10 }}>
                                        已选中{this.state.allselectskey.length > 0 ? this.state.allselectskey.length : 0}个内容，总时长：{sec_to_time(this.state.totalTime)}
                                    </Col>

                                    <Col className={styles.rightButton}>
                                        <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={this.handleOk} disabled={this.state.allselectskey.length != 0 ? false : true}>添加到列表</Button>
                                    </Col>
                                </Row>
                                <Spin tip="加载中..." spinning={listLoading} size="large" style={{ zIndex: 9999 }}>
                                    <Table
                                        rowKey={this.props.rowKey}
                                        rowSelection={rowSelection}
                                        columns={columns}
                                        dataSource={_.get(audioList, 'list', [])}
                                        pagination={{
                                            size: "small",
                                            total: _.get(audioList, 'total', 0),
                                            showSizeChanger: false,
                                            showQuickJumper: false,
                                            onChange: (page) => {
                                                this.query(page)
                                            }
                                        }}
                                        scroll={{ y: 350 }}
                                        bordered

                                    />
                                </Spin>

                            </div>
                        </Content>

                    </Layout>
                </Layout>
            </Modal>
        )
    }
}




