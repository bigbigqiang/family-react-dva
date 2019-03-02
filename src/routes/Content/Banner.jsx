import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Select, Icon, Table } from 'antd';
import styles from './Banner.less'
import { AddBanner } from '../../components/Banner'
import moment from 'moment';
import { dict } from '../../utils/dict';
const { Option } = Select;

@connect(state => ({
    banner: state.banner,
    // course: state.course
}))
@Form.create()
export default class Banner extends PureComponent {
    state = {
        searchStatus: "NORMAL"
    }
    componentDidMount() {
        this.handleSearch()
    }

    saveFormRef = (form) => {
        this.form = form; // 作为主页面，需要将子component的form引用到主页面
    }

    // ↓ 有关banner列表 --------------------------

    handleSearch = (arg) => {
        this.props.dispatch({
            type: 'banner/fetch',
            payload: {
                status: this.state.searchStatus
            }
        })
    }

    handleEditBanner = (bannerCode) => {
        this.props.dispatch({
            type: 'banner/fetchOneBanner',
            payload: bannerCode
        })
    }

    changeBannerStatus = (bannerCode, status) => {
        let values = {
            status: this.state.searchStatus
        }
        this.props.dispatch({
            type: 'banner/changeBannerStatus',
            payload: { bannerCode, status, values }
        })
    }
    changeBannerSort = (bannerCode, sequence) => {
        this.props.dispatch({
            type: 'banner/changeBannerSort',
            payload: {
                bannerCode: bannerCode
                , sequence: sequence
                , status: this.state.searchStatus
            }
        })
    }


    // ↓ 有关添加Banner Modal --------------------------

    hideAddModal = () => {
        const form = this.form;
        this.props.dispatch({
            type: 'banner/toggleAdd',
            payload: false
        })
        form.resetFields()
    }

    showAddModal = () => {
        this.props.dispatch({
            type: 'banner/toggleAdd',
            payload: true
        })
    }

    handleAddBanner = (meta) => {
        const form = this.form;// 内层form，通过ref引入进来的。addBanner Component 的提交表单
        const form2 = this.props.form; // 本层form，Banner的筛选form

        form2.validateFields((err, values_father) => {
            if (err) {
                console.error('Received Errors: ', err);
                return;
            }
            form.validateFields((err, values) => {
                if (err) {
                    console.error('Received Errors: ', err);
                    return;
                }
                form.resetFields();
                this.props.dispatch({
                    type: 'banner/addBanner',
                    payload: {
                        meta,
                        values,
                        searchStatus: this.state.searchStatus,
                        ...values_father
                    }
                })
            });
        });

    }

    handleLoading = (boolean) => {
        this.props.dispatch({
            type: 'banner/imgUploadLoading',
            payload: boolean
        })
    }

    // ↓ 选择目标图书 相关 ----------------------------

    /**
     * @description 为课程设置选择图书 / 设置图书
     *              设置图书的同时，把当前course的筛选条件也发过去了
     *              目的是为了在设置好图书后，继续留在之前筛选的页面，而不是重置 大班 上学期 精读
     * @param {array} week 在Banner图中，week没有用，取不到值的
     * @param {string} selectedBook 所选择书的ID
     */
    handleBookSelected = ({ selectedBook }) => {
        // console.log(selectedBook)
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'banner/setBook',
                    payload: {
                        bookName: selectedBook.book_name,
                        bookCode: selectedBook.key
                    }
                })
                this.hideBookModal();
            } else {
                console.log(err);
            }
        });
    }

    clearBookSet = () => {
        this.props.dispatch({
            type: 'clearBook',
        })
    }

    // 图片上传处理--------------------
    render() {

        const that = this;

        const { searchStatus } = this.state;
        // const statusName = {
        //     'OFFLINE': '已下线',
        //     'EXCEPTION': '草稿',
        //     'NORMAL': '已上线',
        // }

        const columns = [
            {
                title: '图片标题',
                dataIndex: 'bannerTitle',
                key: 'bannerTitle'
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
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
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => {
                    return dict('BANNER_' + text, {
                        type: 'badge'
                    })
                }
            }, {
                title: '位置操作',
                width: 90,
                align: 'center',
                className: styles.operation,
                render(text, record, index) {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => that.changeBannerSort(record.bannerCode, 'forward')} disabled={record.canMove == 'no' || record.sortType == 'head'}>
                                <Icon type="arrow-up" />
                            </Button>
                            <Button type="primary" onClick={() => that.changeBannerSort(record.bannerCode, 'back')} disabled={record.canMove == 'no' || record.sortType == 'tail'}>
                                <Icon type="arrow-down" />
                            </Button>
                        </Button.Group>
                    )
                }
            }, {
                title: '其它操作',
                width: 152,
                align: 'center',
                className: styles.operation,
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => this.handleEditBanner(record.bannerCode)}>
                                <Icon type="edit" />编辑
                            </Button>
                            <Button type={record.status === 'NORMAL' ? 'primary' : 'default'} onClick={() => this.changeBannerStatus(record.bannerCode, record.status === 'NORMAL' ? 'OFFLINE' : 'NORMAL')}>
                                <Icon type={record.status === 'NORMAL' ? 'pause' : 'retweet'} />{record.status === 'NORMAL' ? '下线' : '上线'}
                            </Button>
                        </Button.Group>
                    )
                }
            }
        ]

        for (var key in columns) {
            columns[key].align = 'center'
        }

        const { banner: {
            banner_list,
            add_show,
            img_loading,
            book_btn_name,
            nowEditBanner
        } } = this.props;

        const { getFieldDecorator } = this.props.form;

        const searchDom = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                >
                    <Col span={4} >
                        <Select
                            defaultValue={searchStatus}
                            onChange={(value) => {
                                this.setState({ searchStatus: value }, () => this.handleSearch({ status: value }))
                            }}
                        >
                            <Option value={null}>全部</Option>
                            <Option value="NORMAL">已上线</Option>
                            <Option value="EXCEPTION">草稿</Option>
                            <Option value="Offline">已下线</Option>
                        </Select>
                    </Col>
                    <Col className={styles.rightButton}>
                        <Button type="primary" onClick={this.showAddModal} >
                            <Icon type="plus-circle-o" />添加新图片
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
                            dataSource={banner_list}
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
                <AddBanner
                    visible={add_show}
                    imgLoading={img_loading}
                    handleCancel={this.hideAddModal}
                    handleAdd={this.handleAddBanner}
                    handleLoading={this.handleLoading}
                    nowEditBanner={nowEditBanner}
                    onSuccess={this.handleSuccess}
                    ref={this.saveFormRef}
                />
            </div >
        )
    }
}
