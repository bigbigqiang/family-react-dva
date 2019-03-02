import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message, Modal, Checkbox, Tooltip, Popconfirm, Layout, DatePicker, Spin } from 'antd';
import moment from 'moment';
import styles from './index.less'
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const { Header, Content, Sider, Footer } = Layout;
@connect(state => ({
    customedit: state.customedit,
}))
export default class AddBook extends Component {
    state = {
        pageIndex: 1,
        pageSize: 10,
        searchText: '',
        state: '',
        loading: false,
        bookData: [],
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
        //渠道
        bookDomainRelation: {
            domainSecondCode: ''
        },
        firstBookDomainRelation: {
            domainFirstCode: ''
        },
        //领域
        bookDomainClassList: [{
            domainCode: '',
            domainName: '',
            parentCode: '',
        }],
        bookSecondClassList: [{
            domainCode: '',
            domainName: '',
        }],
        book: {
            //出版社
            publishCode: '',
            bookName: ''

        },
        goods: {
            //年级
            gradeCode: ""
        },
        bookAuthorRelation: {
            //作者
            authorCode: ""
        },
        allselectsData: [],
        allselectskey: []



    }
    componentDidMount() {
        this.bookResultItem();
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
            type: 'customedit/hidePlanModal'
        });
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            allselectskey: [],
            allselectsData: [],
            createBeginTime: ''

        })
        this.clearSelect()
    }

    /*select选择相关*/
    bookResultItem() {
        this.props.dispatch({
            type: 'customedit/bookResultItem',
            payload: {}

        })
    }


    getInputValue = (value) => {
        this.setState({
            book: {
                ...this.state.book,
                bookName: value
            }
        }, () => {

        }
        )
    }
    fetchSearchBook(text) {
        this.setState({
            book: {
                ...this.state.book,
                bookName: text
            }
        }, () => {
            this.bookListFn(this.state.book.bookName, this.state.createBeginTime, this.state.book.publishCode, this.state.bookAuthorRelation.authorCode, this.state.goods.gradeCode, this.state.firstBookDomainRelation.domainFirstCode, this.state.bookDomainRelation.domainSecondCode, '', 10);
        }
        )
    }
    createBeginTime(value, dateString, str) {
        this.setState({
            createBeginTime: dateString
        })
    }
    /*获取图书列表*/
    bookListFn(bookName, sendDate, publishCode, authorCode, gradeCode, domainFirstCode, domainSecondCode, pageIndex, pageSize) {
        this.props.dispatch({
            type: 'customedit/columnQueryBookList',
            payload: {
                bookName: bookName,
                sendDate: sendDate,
                publishCode: publishCode,
                authorCode: authorCode,
                gradeCode: gradeCode,
                domainFirstCode: domainFirstCode,
                domainSecondCode: domainSecondCode,
                pageIndex: pageIndex,
                pageSize: pageSize
            }

        })
    }
    clearSelect() {
        this.setState({
            bookDomainRelation: {
                domainSecondCode: ''
            },
            firstBookDomainRelation: {
                domainFirstCode: ''
            },
            bookDomainClassList: [{
                domainCode: '',
                domainName: '',
                parentCode: '',
            }],
            bookSecondClassList: [{
                domainCode: '',
                domainName: '',
            }],
            book: {
                //出版社
                publishCode: '',
                bookName: ''

            },
            goods: {
                gradeCode: ""
            },
            bookAuthorRelation: {
                authorCode: ""
            },
            createBeginTime: ''


        })
    }
    query(page) {

        if (this.state.bookDomainRelation.domainSecondCode == '' && this.state.firstValue == false) {
            message.error('请选择子领域');
            return;
        }
        this.bookListFn(this.state.book.bookName, this.state.createBeginTime, this.state.book.publishCode, this.state.bookAuthorRelation.authorCode, this.state.goods.gradeCode, this.state.firstBookDomainRelation.domainFirstCode, this.state.bookDomainRelation.domainSecondCode, page, 10);
    }

    bookPublishChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                publishCode: value
            }
        })

    }
    bookAuthorChange(str, value) {

        this.setState({
            bookAuthorRelation: {
                //作者
                authorCode: value
            }
        }, () => {

        })
    }
    goodsStateChange(str, value) {
        this.setState({
            goods: {
                ...this.state.goods,
                gradeCode: value
            }
        }, () => {
        })
    }
    /*领域*/
    bookDomainRelationChange(bookDomainClassList, str, value) {
        console.log(value);
        if (bookDomainClassList) {
            const secondeList = [];
            let list = bookDomainClassList;
            for (let i = 0; i < list.length; i++) {
                if (list[i].parentCode == value) {
                    secondeList.push({
                        domainCode: list[i].domainCode,
                        domainName: list[i].domainName
                    })
                }
            }
            this.setState({
                bookDomainRelation: {
                    domainSecondCode: ''
                },
                firstBookDomainRelation: {
                    domainFirstCode: value
                },
                bookSecondClassList: secondeList,
                firstValue: false
            }, () => {

            })
        }

    }
    bookSecondChange(str, value) {
        this.setState({
            bookDomainRelation: {
                domainSecondCode: value
            },
            firstValue: true
        })
    }
    render() {
        const { loading, modal, pageSize, selectedRowKeys, selectedRows } = this.state;
        const { visible, rowKey } = this.props;
        const { customedit: { publishList, authorList, bookDomainClassList, bookData, listLoading } } = this.props;
        const columns = [
            {
                title: '图书名称',
                width: 150,
                align: 'center',
                dataIndex: 'bookName',
                key: 'bookName'

            },
            {
                title: '传送时间',
                width: 150,
                align: 'center',
                dataIndex: 'createTime',
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
            },
            {
                title: '适用年级',
                dataIndex: 'gradeName',
                align: 'center',
                width: 100,
                key: 'gradeName'
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
                var curKays = this.state.allselectskey;
                var curdata = this.state.allselectsData;

                if (selected == true) {
                    console.log(record);
                    curKays.push(record[this.props.rowKey]);
                    curdata.push(record);

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
                        }

                    });

                }
                this.setState({
                    allselectskey: curKays,
                    allselectsData: curdata
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                var curKays = this.state.allselectskey;
                var curdata = this.state.allselectsData;
                if (selected == true) {
                    for (var i = 0; i < changeRows.length; i++) {
                        curKays.push(changeRows[i][this.props.rowKey]);
                    }

                    curdata.push(...changeRows);

                } else {
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
                    allselectsData: curdata
                }, () => {

                }
                )
            }
        }
        return (
            <Modal
                className={styles.addModal}
                visible={visible}
                title="添加图书"
                onCancel={this.onCancel}
                onOk={this.handleOk}
                footer={null}
            >
                <Layout>
                    <Sider width={190} style={{ background: '#fff' }}>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>精确检索</span>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>传送时间</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(value, dateString) => { this.createBeginTime(value, dateString, "createBeginTime") }}
                                value={this.state.createBeginTime != '' ? moment(this.state.createBeginTime, 'YYYY-MM-DD') : null}
                                className={styles.slideRight}
                            />
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>出版社</span>
                            <Select className={styles.slideRight} value={this.state.book.publishCode} style={{ width: 113 }} onChange={(value) => this.bookPublishChange("bookPublish", value)} >
                                <Option value=''>全部</Option>
                                {
                                    publishList ? publishList.map(function (item, index) {
                                        if (item) {
                                            return <Option key={index} value={item.uid}>{item.publishName}</Option>
                                        }
                                    }) : []
                                }
                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>作者</span>
                            <Select className={styles.slideRight} value={this.state.bookAuthorRelation.authorCode} style={{ width: 113 }} onChange={(value) => this.bookAuthorChange("bookPublish", value)}>
                                <Option value=''>全部</Option>
                                {
                                    authorList ? authorList.map(function (item, index) {
                                        return <Option key={index} value={item.authorCode}>{item.authorName}</Option>
                                    }) : []
                                }
                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>适用年级</span>
                            <Select className={styles.slideRight} value={this.state.goods.gradeCode} style={{ width: 113 }} onChange={(value) => this.goodsStateChange("bookPublish", value)}>
                                <Option value=''>全部</Option>
                                <Option value='2'>小班</Option>
                                <Option value='3'>中班</Option>
                                <Option value='4'>大班</Option>

                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <span className={styles.uTxt}>领域</span>
                            <Select value={this.state.firstBookDomainRelation.domainFirstCode} className={styles.slideRight} style={{ width: 113 }} onChange={(value) => this.bookDomainRelationChange(bookDomainClassList, "bookDomainClassList", value)}>
                                <Option value=''>全部</Option>
                                <Option value="01">健康</Option>
                                <Option value="02">语言</Option>
                                <Option value="03">社会</Option>
                                <Option value="04">科学</Option>
                                <Option value="05">艺术</Option>
                                <Option value="06">全领域</Option>
                            </Select>
                        </div>
                        <div className={styles.slideAll}>
                            <Select value={this.state.bookDomainRelation.domainSecondCode} className={styles.slideRight} style={{ width: 113 }} onChange={(value) => this.bookSecondChange("bookSecondClassList", value)}>
                                <Option value=''>全部</Option>
                                {
                                    this.state.bookSecondClassList.map(function (item, index) {
                                        return <Option key={index} value={item.domainCode}>{item.domainName}</Option>
                                    })
                                }
                            </Select>
                        </div>

                        <div className={styles.mselect} ><Button onClick={() => this.clearSelect()}>恢复默认</Button></div>
                        <div className={styles.mselect}><Button onClick={() => this.query(this.state.currentPage)}>查询</Button></div>

                    </Sider>
                    <Layout>
                        <Content style={{ background: '#fff', margin: 0, minHeight: 408 }}>
                            <div id="addNewBook" style={{ padding: "0px 0 0 20px", "position": "relative" }}>
                                <Row style={{ marginBottom: 16 }} align='middle'>
                                    <Col>
                                        <Search placeholder="搜索" enterButton onBlur={(e) => { this.getInputValue(e.target.value) }} onPressEnter={(e) => { this.fetchSearchBook(e.target.value, 0) }} onSearch={() => { this.fetchSearchBook(this.state.book.bookName, 0) }} />
                                    </Col>
                                </Row>
                                <Spin tip="加载中..." spinning={listLoading} size="large" style={{ zIndex: 9999 }}>
                                    <Table
                                        rowKey={this.props.rowKey}
                                        rowSelection={rowSelection}
                                        columns={columns}
                                        dataSource={_.get(bookData, 'dataList', [])}
                                        pagination={{
                                            size: "small",
                                            total: _.get(bookData, 'total', 0),
                                            showSizeChanger: false,
                                            showQuickJumper: false,
                                            onChange: (page) => {
                                                this.query(page)
                                            }
                                        }}
                                        onChange={() => { }}
                                        scroll={{ y: 350 }}
                                        bordered

                                    />
                                </Spin>
                                <div className={styles.allelects}>
                                    <span className={styles.allchecks}>全选</span>
                                    <span
                                        className="curSelected"><span>{this.state.allselectskey.length}</span>/<span>{_.get(bookData, 'total', 0)}</span></span>
                                </div>
                            </div>
                        </Content>
                        <Footer style={{ "textAlign": "center" }}>
                            <Button type="primary" key="submit" onClick={this.handleOk} disabled={this.state.allselectskey.length != 0 ? false : true}>添加</Button>
                        </Footer>
                    </Layout>
                </Layout>
            </Modal>
        )
    }
}




