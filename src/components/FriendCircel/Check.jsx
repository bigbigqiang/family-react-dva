import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Select, Modal, DatePicker, Table } from 'antd';
const Option = Select.Option;
import styles from './Check.less';
import moment from 'moment';
@connect(state => ({
    friendCircle: state.friendCircle
}))
export default class Check extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            resultData: [],
            domainFirstCode: '',
            domainSecondCode: '',
            publishCode: '',
            authorCode: '',
            gradeCode: '',
            sendDate: '',
            bookName: '',
            pageIndex: 1,
            pageSize: 10,
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'friendCircle/getSearchCondition',
            payload: {}
        });
        this.getBookList();
    }
    getBookList(pageIndex, pageSize) {
        let searchType = this.state;
        // delete searchType['visible'];
        this.setState({
            pageIndex: pageIndex || this.state.pageIndex,
            pageSize: pageSize || this.state.pageSize
        })
        this.props.dispatch({
            type: 'friendCircle/getBookList',
            payload: {
                // domainFirstCode: '',
                // domainSecondCode: '',
                ...searchType,
                pageIndex: pageIndex || this.state.pageIndex,
                pageSize: pageSize || this.state.pageSize
            }
        })
    }
    render() {

        const { dispatch } = this.props;
        const { friendCircle } = this.props;
        const { bookDomainList, gradeList, originalAuthorList, publishList, bookList, total, bookListLodaing } = friendCircle;
        const columns = [
            {
                title: '图书名称',
                dataIndex: 'bookName',
                key: 'bookName',
                width: 200,
                align: 'center'
            }, {
                title: '传送时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
                align: 'center',
                render: (text) => moment(text).format('YYYY-MM-DD')
            }, {
                title: '适用年级',
                dataIndex: 'gradeName',
                key: 'gradeName',
                width: 100,
                align: 'center'
            }
        ];
        return (
            <div >
                <Button type='primary' onClick={() => { this.setState({ visible: true }) }}>{this.props.text}</Button>
                <Modal
                    title="选择推荐图书"
                    visible={this.state.visible}
                    onOk={() => {
                        this.setState({ visible: false }, () => {
                            this.props.onChange(this.state.resultData);
                        })
                    }}
                    onCancel={() => {
                        this.setState({ visible: false });
                    }}
                    width={1000}
                    className={styles.check}
                >

                    <div className={styles.left}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>精确搜索</p>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}>传送时间:</span>
                            <DatePicker format="YYYY-MM-DD" value={this.state.sendDate ? moment(this.state.sendDate) : null} onChange={(v, sendDate) => { console.log(sendDate); this.setState({ sendDate }) }} />
                        </div>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}>出版社:</span>
                            <Select value={this.state.publishCode} style={{ width: 220 }} onChange={(v) => { this.setState({ publishCode: v }) }} placeholder='122'>
                                {
                                    publishList.map(item => {
                                        if (item) {
                                            return <Option key={item.uid} value={item.uid}>{item.publishName}</Option>
                                        }
                                    })
                                }
                                <Option value={''}>全部出版社</Option>
                            </Select>
                        </div>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}>作者</span>
                            <Select value={this.state.authorCode} style={{ width: 220 }} onChange={(v) => { this.setState({ authorCode: v }) }}>
                                {
                                    originalAuthorList.map(item => <Option key={item.authorCode} value={item.authorCode}>{item.authorName}</Option>)
                                }
                                <Option value={''}>全部作者</Option>
                            </Select>
                        </div>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}>适用年级</span>
                            <Select value={this.state.gradeCode} style={{ width: 220 }} onChange={(v) => { this.setState({ gradeCode: v }) }}>
                                {
                                    gradeList.map(item => <Option key={item.gradeCode} value={item.gradeCode}>{item.gradeName}</Option>)
                                }
                                <Option value={''}>全部年级</Option>
                            </Select>
                        </div>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}>领域</span>
                            <Select
                                value={this.state.domainFirstCode}
                                style={{ width: 220 }}
                                onChange={(v) => {
                                    this.setState({
                                        domainFirstCode: v,
                                        domainSecondCode: (bookDomainList.filter(item => item.parentCode == v)[0] || {}).domainCode || ''
                                    })
                                }}>
                                {
                                    bookDomainList.filter(item => item.parentCode == '0').map(item => <Option key={item.domainCode} value={item.domainCode}>{item.domainName}</Option>)

                                }
                                <Option value={''}>全部领域</Option>
                            </Select>
                        </div>
                        <div className={styles.searchBox}>
                            <span className={styles.searchTitle}></span>
                            {
                                this.state.domainFirstCode && <Select value={this.state.domainSecondCode} style={{ width: 220 }} onChange={(v) => { this.setState({ domainSecondCode: v }) }}>
                                    {
                                        bookDomainList.filter(item => item.parentCode == this.state.domainFirstCode).map(item => <Option key={item.domainCode} value={item.domainCode}>{item.domainName}</Option>)
                                    }
                                </Select>
                            }
                        </div>
                        <div className={styles.searchBox}>
                            <Button type='primary' style={{ margin: '0 20px 0 30px' }}
                                onClick={() => { this.getBookList() }}
                            >查询</Button>
                            <Button type='primary' onClick={() => {
                                this.setState({
                                    domainFirstCode: '',
                                    domainSecondCode: '',
                                    publishCode: '',
                                    authorCode: '',
                                    gradeCode: '',
                                    sendDate: '',
                                    bookName: '',
                                    pageIndex: 1,
                                    pageSize: 10
                                }, () => { this.getBookList() })
                            }}>恢复默认值</Button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Input.Search
                            placeholder="请输入图书名称"
                            onChange={(e) => { this.setState({ bookName: e.target.value }) }}
                            onSearch={value => this.getBookList(1)}
                            enterButton
                        />
                        <Table
                            loading={bookListLodaing}
                            columns={columns}
                            dataSource={bookList}
                            pagination={{
                                total: total,
                                current: this.state.pageIndex,
                                pageSize: this.state.pageSize,
                                onChange: (pageIndex, pageSize) => {
                                    this.getBookList(pageIndex, pageSize);
                                },
                                onShowSizeChange: (pageIndex, pageSize) => {
                                    this.getBookList(pageIndex, pageSize);
                                },
                                showSizeChanger: true,

                            }}
                            rowSelection={{
                                type: 'radio',
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({
                                        resultData: selectedRows
                                    })
                                }
                            }}
                            scroll={{ y: 240 }}
                            rowKey='bookCode'
                        />
                    </div>
                    <div className={styles.block}></div>

                </Modal>
            </div >
        )
    }
}
