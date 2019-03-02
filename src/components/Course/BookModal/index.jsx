import React, { PureComponent, Component } from 'react';
import { Row, Col, Modal, Table, Form, Input, Icon, Pagination } from 'antd';
import styles from './index.less';

const { Search } = Input;

export default class BookModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            selectedRowKeys: [],
            selectedBook: null,
            loading: false
        };
    }
    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({ userName: '' });
    }
    onChangeUserName = (e) => {
        this.setState({ userName: e.target.value });
    }

    render() {

        const { userName, selectedRowKeys, selectedBook } = this.state;
        const suffix = userName ? <Icon key type="close-circle" onClick={this.emitEmpty} /> : null;

        const { week } = this.props;

        const columns = [
            {
                title: '图书名称',
                dataIndex: 'book_name',
                key: 'book_name'
            }, {
                title: '上架时间',
                dataIndex: 'stack_time',
                key: 'stack_time',
                render(text, record, index) {
                    let result = new Date(record.stack_time * 1);
                    return (
                        <span>{result.getFullYear()}-{result.getMonth() + 1}-{result.getDate()}</span>
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'book_status',
                key: 'book_status',
                render: (text, record, index) => {
                    return {
                        'NORMAL': '已上架',
                        'EXCEPTION': '已下架'
                    }[record.book_status]
                }
            }
        ];

        const { handleBookSelected, handleSearchBook, book_data, set_course_now, loading } = this.props;

        /**
         * @description antd 组件参数，设置Table行可选
         * @prop {string} type 单选
         * @method onChange 选择之后的处理，使用一个selectedBook变量存储当前选择的行 key
         */
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                // TODO: 目前选择的是数据的 key ，需要与后端的 bookCode 对应起来
                this.setState({
                    selectedRowKeys,
                    selectedBook: selectedRows[0]
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };

        return (
            this.props.visible && <Modal
                width='960px'
                title={'选择图书'}
                visible={this.props.visible}
                onCancel={() => {
                    this.setState({
                        selectedRowKeys: [],
                        selectedBook: [],
                        userName: '',
                        currentPage: 1
                    });
                    this.props.onCancel()
                }}
                onOk={() => {
                    this.setState({
                        selectedRowKeys: [],
                        selectedBook: [],
                        userName: '',
                        currentPage: 1
                    });
                    handleBookSelected({
                        week, selectedBook, set_course_now
                    })
                }}
            >
                <Row>
                    <Search
                        className={styles.book_search}
                        enterButton
                        defaultValue=''
                        placeholder='请输入要搜索的书名'
                        onSearch={(value) => {
                            handleSearchBook({
                                book: value
                            });
                            this.setState({
                                currentPage: 1
                            })
                        }}
                        suffix={suffix}
                        value={userName}
                        onChange={this.onChangeUserName}
                        ref={node => this.userNameInput = node}
                    />
                </Row>
                <Row>
                    <Table
                        rowSelection={rowSelection}
                        size='small'
                        columns={columns}
                        dataSource={book_data}
                        loading={loading}
                        pagination={{
                            current: this.state.currentPage,
                            size: "small",
                            showSizeChanger: true,
                            showQuickJumper: true,
                            hideOnSinglePage: true,
                            onChange: (page, pageSize) => {
                                this.setState({
                                    currentPage: page
                                })
                            }
                        }}
                    >
                    </Table>
                </Row>
            </Modal >
        )
    }
}