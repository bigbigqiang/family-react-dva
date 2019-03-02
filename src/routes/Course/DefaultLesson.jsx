import React, { PureComponent } from 'react';
import { Modal, Calendar, Button, Form, Row, Col, Table, Icon, Input, Select, Popover, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './DefaultLesson.less'
import { PlanModal, BookDetailModal, WorkModal } from '../../components/Lesson'
import { cacheManager } from '../../utils/utils';

const { MonthPicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    lesson: state.lesson
}))
@Form.create()
export default class DefaultLesson extends PureComponent {
    state = {
        booklistloading: false
        , visible: false
        , searchVisible: false
        , selectedRowKeys: []
        , value: moment(new Date())
        , selectedValue: moment(new Date())
        , gradeCode: '4'
        , isKinder: cacheManager.get("ellahome_CGC") != null
        , bookSearchConfig: {
            bookName: ''
            , gradeCode: ''
            , publishCode: ''
            , domainCode: ''
            , classCode: ''
            , status: ''
            , pageSize: 10
            , page: 0
        }
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false
        });
    }
    moreConditions = (e) => {
        this.setState({ checked: !this.state.checked, searchVisible: !this.state.checked });
    }
    //预览相关
    ellaReaderFn(bookCode, bookName, bookModeResource, type) {
        // console.log(bookModeResource);
        // console.log(type);
        let url2 = "";	//url1  封面资源；   url2 图书资源
        if (type == "iphonex") {
            for (let j = 0; j < bookModeResource.length; j++) {
                if (bookModeResource[j].resource.toLowerCase() == "iphone2208") {		//预览视频
                    url2 = bookModeResource[j].ossUrl;
                }
            }
        } else {
            for (let i = 0; i < bookModeResource.length; i++) {
                if (bookModeResource[i].resource.toLowerCase() == "normal") {
                    url2 = bookModeResource[i].ossUrl;
                }
            }
        }

        if (cacheManager.get("ellaReader") && cacheManager.get("ellaReader") != null) {
            window.openReader(bookCode, bookName, url2, type);
        } else {
            window.loadReader();
            cacheManager.set("ellaReader", "true");
        }
    }
    getLesson() {
        //获取课程信息
        this.props.dispatch({
            type: 'lesson/getLesson',
            payload: {
                scheduleTime: this.state.selectedValue.format('YYYY-MM-DD'),
                scheduleType: 'default',
                gradeCode: this.state.gradeCode
            }
        })
    }
    init() {
        this.props.dispatch({
            type: 'lesson/lessonInitDefault'
        })
        this.getLesson()
    }
    getBookList() {
        this.setState({
            booklistloading: true
        })
        //获取图书列表
        this.props.dispatch({
            type: 'lesson/getBookList',
            payload: {
                applyGradeCode: this.state.bookSearchConfig.gradeCode,
                domainCode: this.state.bookSearchConfig.domainCode,
                bookPublish: this.state.bookSearchConfig.publishCode,
                classCode1: this.state.bookSearchConfig.classCode,
                bookName: this.state.bookSearchConfig.bookName,
                status: this.state.bookSearchConfig.status,
                page: this.state.bookSearchConfig.page,
                pageSize: this.state.bookSearchConfig.pageSize,
                scheduleType: 'default',
                scheduleParam: {
                    gradeCode: this.state.gradeCode,
                    scheduleTime: this.state.selectedValue.format('YYYY-MM-DD')
                }
            }
        }).then(() => { this.setState({ booklistloading: false }) })
    }
    addBookToDefaultLesson(bookCode) {
        this.props.dispatch({
            type: 'lesson/addBookToDefaultLesson',
            payload: {
                scheduleTime: this.state.selectedValue.format('YYYY-MM-DD'),
                gradeCode: this.state.gradeCode,
                bookCode: bookCode
            }
        })
        this.refrush()
    }
    delBookFromDefaultLesson(bookCode, date) {
        let theTime = null;
        if (date) {
            theTime = date.format('YYYY-MM-DD');
        }
        this.props.dispatch({
            type: 'lesson/delBookFromDefaultLesson',
            payload: {
                scheduleTime: theTime || this.state.selectedValue.format('YYYY-MM-DD'),
                gradeCode: this.state.gradeCode,
                scheduleType: 'default',
                bookCode: bookCode
            }
        })
        this.refrush()
    }
    refrush() {
        setTimeout(() => this.getBookList(), 400)
        setTimeout(() => this.getLesson(), 600)
    }
    componentDidMount() {
        this.init()
    }
    render() {
        const that = this;
        let { lesson: {
            bookList,
            bookListCount,
            bookSelectedCount,
            bookTopicClassList,
            bookDomainClassList,
            publishlist,
            gradeList,
            lesson_data_def,
            cusVisible,
            bookInfoVisible,
            workVisible,
            bookInfo } } = this.props;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                key: 'bookName',
                title: '书名',
                dataIndex: 'bookName'
            }, {
                key: 'businessTrueName',
                title: '出版社',
                align: 'center',
                dataIndex: 'businessTrueName'
            }, {
                key: 'domainName',
                title: '领域',
                align: 'center',
                dataIndex: 'domainName',
                width: 80,
            }, {
                key: 'className',
                title: '主题分类',
                align: 'center',
                dataIndex: 'className',
                width: 80,
            }, {
                key: 'gradeName',
                title: '年级',
                align: 'center',
                dataIndex: 'gradeName',
                width: 45,
            }, {
                key: 'goodsPublishTime',
                title: '上架时间',
                dataIndex: 'goodsPublishTime',
                align: 'center',
                width: 90,
                render: (text, record) => {
                    return <span title={record.goodsPublishTime}>{record.goodsPublishTime.slice(0, 10)}</span>
                }
            }, {
                key: 'detail',
                title: '图书详情',
                align: 'center',
                width: 180,
                render: (text, record) => {
                    return (<div>
                        <span onClick={() => { handleShowDetail(record) }} className={styles.btnSpan}>查看</span>&nbsp;
                        <span onClick={() => { handleShowPlan(record.bookCode) }} className={styles.btnSpan}>教案</span>&nbsp;
                        <span onClick={() => { handleShowWork(record.bookCode) }} className={styles.btnSpan}>作业</span>&nbsp;
                        <Select
                            style={{ width: 60, height: 25, fontSize: 12 }}
                            placeholder="预览"
                            onChange={value => {
                                this.ellaReaderFn(record.bookCode, record.bookName, record.bookModeResourceList, value)
                            }}
                            dropdownStyle={{ fontSize: 12, width: 60 }}>
                            <Option value="iphone">iPhone6</Option>
                            <Option value="iphonex">iPhoneX</Option>
                            <Option value="ipad">iPad</Option>
                            <Option value="pc">PC</Option>
                        </Select>

                    </div>)
                }
            }, {
                key: 'status',
                title: '操作',
                dataIndex: 'status',
                align: 'center',
                render: (text, record) => {
                    switch (record.status) {
                        case 'unselected':
                            return <Button size='small' type='default' onClick={() => this.addBookToDefaultLesson(record.bookCode)}>确认选择</Button>
                        case 'selected':
                            return <Button size='small' type='primary' onClick={() => this.delBookFromDefaultLesson(record.bookCode)}>取消选择</Button>
                    }
                }
            }
        ].map(item => { item.align = 'center'; return item; })

        //作业
        const handleShowWork = (bk) => {
            this.props.dispatch({
                type: 'lesson/getWorkList',
                payload: {
                    bookCode: bk
                }
            })
            this.setState({ bookCode: bk });
        }
        const handleHideWork = () => {
            this.props.dispatch({
                type: 'lesson/hideWorkModal'
            })
        }
        //图书详情
        const handleShowDetail = (bookInfo) => {
            this.props.dispatch({
                type: 'lesson/showBookDetailModal',
                payload: {
                    bookInfo: bookInfo
                }
            })
        }
        const handleHideBookDetailModal = () => {
            this.props.dispatch({
                type: 'lesson/hideBookDetailModal'
            })
        }
        //教案相关
        const handleShowPlan = (bk) => {
            this.props.dispatch({
                type: 'lesson/getPlan',
                payload: { bookCode: bk, kindergarten_code: cacheManager.get("ellahome_CGC") }
            })
            this.setState({ bookCode: bk });
        }
        const handleHidePlan = () => {
            this.props.dispatch({
                type: 'lesson/hidePlanModal'
            })
        }

        //日期控制
        const disabledDate = (current) => {
            return current && current < moment('2018-05-01');
        }

        /**
         * @param {moment} date antd组件返回的moment日期对象
         */
        // const { loading, selectedRowKeys } = this.state;
        const { value, selectedValue } = this.state;
        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                    gutter={8}
                >
                    <Col span={4} >
                        {getFieldDecorator('gradeCode', {
                            initialValue: this.state.gradeCode,
                        })(
                            <Select onChange={(value) => {
                                this.setState({
                                    gradeCode: value
                                })
                                setTimeout(() => this.getLesson(), 500)

                            }}>
                                {
                                    gradeList.map((item) => {
                                        if (item.parentCode == "KINDERGARTEN") {
                                            return (<Option value={item.gradeCode} key={item.gradeCode}>{item.gradeName}</Option>)
                                        }
                                    })
                                }
                            </Select>
                        )}
                    </Col>
                    <Col span={4}>
                        {getFieldDecorator('selectedValue', {
                            initialValue: moment(selectedValue, 'YYYY-MM'),
                        })(
                            <MonthPicker
                                format='YYYY-MM'
                                disabledDate={disabledDate}
                                allowClear={false}
                                onChange={(value) => {
                                    this.setState({
                                        value,
                                        selectedValue: value,
                                    });

                                    setTimeout(() => this.getLesson(), 200)
                                }} />
                        )}
                    </Col>
                </Row>
            </Form>
        )
        const conditions = (<div style={{ width: 328 }}>
            <Input.Group className={styles.i_g_r}>
                <Col span={6} className={styles.conditionTitle}>出版社：</Col>
                <Col>
                    <Select defaultValue={this.state.bookSearchConfig.publishCode} style={{ width: 242 }} onChange={(value) => {
                        let { bookSearchConfig } = this.state
                        bookSearchConfig.publishCode = value
                        this.setState({
                            bookSearchConfig: bookSearchConfig
                        }, () => this.getBookList())
                    }}>
                        <Option value="">全部</Option>
                        {
                            publishlist.map((item, index) => {
                                return (<Option value={item.uid} key={index}>{item.businessTruename}</Option>)
                            })
                        }
                    </Select>
                </Col>
            </Input.Group>
            <Input.Group className={styles.i_g_r}>
                <Col span={6} className={styles.conditionTitle}>年级：</Col>
                <Col>
                    <Select defaultValue={this.state.bookSearchConfig.gradeCode} style={{ width: 242 }} onChange={
                        (value) => {
                            let { bookSearchConfig } = this.state
                            bookSearchConfig.gradeCode = value
                            this.setState({
                                bookSearchConfig: bookSearchConfig
                            }, () => this.getBookList())
                        }
                    }>
                        <Option value="">全部</Option>
                        {
                            gradeList.map((item) => {
                                if (item.parentCode == "KINDERGARTEN") {
                                    return (<Option value={item.gradeCode} key={item.gradeCode}>{item.gradeName}</Option>)
                                }
                            })
                        }
                    </Select>
                </Col>
            </Input.Group>
            <Input.Group className={styles.i_g_r}>
                <Col span={6} className={styles.conditionTitle}>主题分类：</Col>
                <Col>
                    <Select defaultValue={this.state.bookSearchConfig.classCode} style={{ width: 242 }} onChange={
                        (value) => {
                            let { bookSearchConfig } = this.state
                            bookSearchConfig.classCode = value
                            this.setState({
                                bookSearchConfig: bookSearchConfig
                            }, () => this.getBookList())
                        }
                    }>
                        <Option value="">全部</Option>
                        {
                            bookTopicClassList.map((item, index) => {
                                return (<Option value={item.classCode} key={index}>{item.className}</Option>)
                            })
                        }
                    </Select>
                </Col>
            </Input.Group>
            <Input.Group className={styles.i_g_r}>
                <Col span={6} className={styles.conditionTitle}>领域：</Col>
                <Select defaultValue={this.state.bookSearchConfig.domainCode} style={{ width: 242 }} onChange={
                    (value) => {
                        let { bookSearchConfig } = this.state
                        bookSearchConfig.domainCode = value
                        this.setState({
                            bookSearchConfig: bookSearchConfig
                        }, () => this.getBookList())
                    }
                }>
                    <Option value="">全部</Option>
                    {
                        bookDomainClassList.map((item, index) => {
                            if (item.domainCode.length < 4) {
                                return (<Option value={item.domainCode} key={index}>{item.domainName}</Option>)
                            }
                        })
                    }
                </Select>
            </Input.Group>
            <Input.Group className={styles.i_g_r}>
                <Col span={6} className={styles.conditionTitle}>状态：</Col>
                <Select defaultValue={this.state.bookSearchConfig.status} style={{ width: 242 }} onChange={
                    (value) => {
                        let { bookSearchConfig } = this.state
                        bookSearchConfig.status = value
                        this.setState({
                            bookSearchConfig: bookSearchConfig
                        }, () => this.getBookList())
                    }
                }>
                    <Option value="">全部</Option>
                    <Option value="unselected">未选择</Option>
                    <Option value="selected">已选择</Option>
                </Select>
            </Input.Group>
        </div>)
        const booktoolbar = (
            <div>
                <Row><span>已选择:{bookSelectedCount}本</span></Row>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Col span={18}>
                        <Search
                            placeholder="搜索"
                            onSearch={(values) => {
                                this.setState({
                                    bookSearchConfig: { ...this.state.bookSearchConfig, bookName: values, page: 0 }
                                }, () => this.getBookList())

                            }}
                            enterButton
                        /></Col>
                    <Col>
                        <Popover
                            placement="bottom"
                            content={conditions}
                            title={false}
                            trigger="click">
                            <Button type="primary">
                                <div>更多条件<Icon type="down-circle-o" style={{ padding: '3px' }} /></div>
                            </Button>
                        </Popover >
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => { window.loadReader() }} >
                            <Icon type="plus-circle-o" />下载预览工具
                            </Button></Col>
                </Row>
                {this.state.searchVisible ?
                    <div>
                        <Row>
                            <Col span={2}>
                                <div className={styles.rowspan}>出版社</div>
                            </Col>
                            <Col span={4}>
                                <Select defaultValue={this.state.bookSearchConfig.publishCode} style={{ width: 120 }} onChange={(value) => {
                                    let { bookSearchConfig } = this.state
                                    bookSearchConfig.publishCode = value
                                    this.setState({
                                        bookSearchConfig: bookSearchConfig
                                    })
                                }}>
                                    <Option value="">全部</Option>
                                    {
                                        publishlist.map((item, index) => {
                                            return (<Option value={item.uid} key={index}>{item.businessTruename}</Option>)
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={2}>
                                <div className={styles.rowspan}>主题分类</div>
                            </Col>
                            <Col span={4}>
                                <Select defaultValue={this.state.bookSearchConfig.classCode} style={{ width: 120 }} onChange={
                                    (value) => {
                                        let { bookSearchConfig } = this.state
                                        bookSearchConfig.classCode = value
                                        this.setState({
                                            bookSearchConfig: bookSearchConfig
                                        })
                                    }
                                }>
                                    <Option value="">全部</Option>
                                    {
                                        bookTopicClassList.map((item, index) => {
                                            return (<Option value={item.classCode} key={index}>{item.className}</Option>)
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2}><div className={styles.rowspan}>领域</div></Col>
                            <Col span={4}>
                                <Select defaultValue={this.state.bookSearchConfig.domainCode} style={{ width: 120 }} onChange={
                                    (value) => {
                                        let { bookSearchConfig } = this.state
                                        bookSearchConfig.domainCode = value
                                        this.setState({
                                            bookSearchConfig: bookSearchConfig
                                        })
                                    }
                                }>
                                    <Option value="">全部</Option>
                                    {
                                        bookDomainClassList.map((item, index) => {
                                            if (item.domainCode.length < 4) {
                                                return (<Option value={item.domainCode} key={index}>{item.domainName}</Option>)
                                            }
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={2}><div className={styles.rowspan}>年级</div></Col>
                            <Col span={4}>
                                <Select defaultValue={this.state.bookSearchConfig.gradeCode} style={{ width: 120 }} onChange={
                                    (value) => {
                                        let { bookSearchConfig } = this.state
                                        bookSearchConfig.gradeCode = value
                                        this.setState({
                                            bookSearchConfig: bookSearchConfig
                                        })
                                    }
                                }>
                                    <Option value="">全部</Option>
                                    {
                                        gradeList.map((item) => {
                                            if (item.parentCode == "KINDERGARTEN") {
                                                return (<Option value={item.gradeCode} key={item.gradeCode}>{item.gradeName}</Option>)
                                            }
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={2}><div className={styles.rowspan}>状态</div></Col>
                            <Col span={4}>
                                <Select defaultValue={this.state.bookSearchConfig.status} style={{ width: 120 }} onChange={
                                    (value) => {
                                        let { bookSearchConfig } = this.state
                                        bookSearchConfig.status = value
                                        this.setState({
                                            bookSearchConfig: bookSearchConfig
                                        })
                                    }
                                }>
                                    <Option value="">全部</Option>
                                    <Option value="unselected">未选择</Option>
                                    <Option value="selected">已选择</Option>
                                </Select>
                            </Col></Row></div> : ''}
            </div>
        )
        const dateCell = (date) => {
            let books = _.get(lesson_data_def, [date.format('YYYY-MM-DD'), 'books'], [])
            return (
                <div className={styles.cell}>
                    <div className={styles.bookdiv}>
                        {
                            books.map((item, index) => (
                                <div style={{ position: 'relative' }}>
                                    <div className={styles.delBtn} onClick={() => {
                                        that.delBookFromDefaultLesson(item.bookCode, date)
                                    }}>x</div>
                                    <div style={{ color: item.available ? 'rgba(0, 0, 0, 0.65)' : '#a00' }} className={styles.bookNameDiv} key={index}>{item.bookName}</div>
                                </div>
                            ))
                        }

                        {
                            <Button
                                className={styles.selBookBtn}
                                type='normal'
                                onClick={
                                    () => {
                                        this.setState({
                                            visible: date._d.getMonth() === value._d.getMonth()
                                        }, () => this.getBookList());
                                    }
                                }
                            >选书</Button>
                        }
                    </div>
                </div >
            )
        }
        //预览相关
        window.loadReader = function () {
            window.location.href = "http://download.ellabook.cn/EllaPicLib/%E5%92%BF%E5%95%A6%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.exe";
        }
        window.openReader = function (bookCode, bookName, bookModeResource, value) {
            window.location.href = `EllaPreview:|${bookCode},${bookName},${bookModeResource},${value}`;
        }
        return (
            <div>
                {toolbar}
                <Calendar
                    value={value}
                    className={styles.lesson_table_row}
                    dateCellRender={dateCell}
                    onSelect={(value) => {
                        if (selectedValue._d.getMonth() === value._d.getMonth()) {
                            this.setState({
                                value,
                                selectedValue: value,
                            });
                        } else {
                            return false;
                        }
                    }}
                    onPanelChange={(date, mode) => {
                        // console.log(date)
                        // console.log(mode)
                    }}
                />
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={false}
                    width={980} >
                    {booktoolbar}
                    <Table
                        bordered
                        rowKey="bookCode"
                        loading={this.state.booklistloading}
                        dataSource={bookList}
                        columns={columns}
                        size='small'
                        pagination={{
                            total: bookListCount,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            hideOnSinglePage: true,
                            onChange: (page, pageSize) => {
                                this.setState({
                                    bookSearchConfig: { ...this.state.bookSearchConfig, page: page - 1, pageSize: pageSize }
                                }, () => this.getBookList())
                            },
                            onShowSizeChange: (page, pageSize) => {
                                this.setState({
                                    bookSearchConfig: { ...this.state.bookSearchConfig, page: page - 1, pageSize: pageSize }
                                }, () => this.getBookList())
                            }
                        }} />
                </Modal >
                <PlanModal
                    visible={cusVisible}
                    bookCode={this.state.bookCode}
                    onCancel={handleHidePlan} />
                <BookDetailModal
                    visible={bookInfoVisible}
                    bookInfo={bookInfo}
                    onCancel={handleHideBookDetailModal} />
                <WorkModal
                    visible={workVisible}
                    isKinder={this.state.isKinder}
                    bookCode={this.state.bookCode}
                    onCancel={handleHideWork} />

            </div >
        )
    }
}
