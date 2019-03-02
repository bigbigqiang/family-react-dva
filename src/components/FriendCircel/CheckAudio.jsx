import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Select, Modal, DatePicker, Table } from 'antd';
const Option = Select.Option;
import styles from './CheckAudio.less';
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
            searchType: 'audioName',
            searchTypeValue: '',
            pageIndex: 1,
            pageSize: 10,
        }
    }

    componentDidMount() {
        // this.props.dispatch({
        //     type: 'friendCircle/getSearchCondition',
        //     payload: {}
        // });
        this.getAudioList();
    }
    getAudioList(pageIndex, pageSize) {
        let searchType = {};
        // delete searchType['visible'];
        this.setState({
            pageIndex: pageIndex || this.state.pageIndex,
            pageSize: pageSize || this.state.pageSize
        })
        this.props.dispatch({
            type: 'friendCircle/getAudioList',
            payload: {
                // domainFirstCode: '',
                // domainSecondCode: '',
                // ...searchType,
                [this.state.searchType]: this.state.searchTypeValue,
                pageNum: pageIndex || this.state.pageIndex,//后台名字叫pageNum懒得改了pageIndex
                pageSize: pageSize || this.state.pageSize
            }
        })
    }
    render() {

        const { dispatch } = this.props;
        const { friendCircle } = this.props;
        const { audioList, audioTotal, audioListLodaing } = friendCircle;
        // console.log(audioList, audioTotal);
        const columns = [
            {
                title: '音频Code',
                dataIndex: 'audioCode',
                key: 'audioCode',
                width: 300,
                align: 'center'
            }, {
                title: '音频名称',
                dataIndex: 'audioName',
                key: 'audioName',
                width: 200,
                align: 'center'
            }, {
                title: '对应图书名称',
                dataIndex: 'bookName',
                key: 'bookName',
                width: 200,
                align: 'center',
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 200,
                align: 'center',
                render: (text) => moment(text).format('YYYY-MM-DD')
            }, {
                title: '时长',
                dataIndex: 'audioTimeLength',
                key: 'audioTimeLength',
                width: 100,
                align: 'center',
                render: (text) => {
                    return parseInt(text / 60) + '′' + parseInt(text % 60) + '″'
                }
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


                    <div className={styles.right}>
                        <Input.Group compact>
                            <Select style={{ width: '20%' }} value={this.state.searchType} onChange={(v) => { this.setState({ searchType: v }) }} >
                                <Option value="audioCode">音频ID</Option>
                                <Option value="audioName">音频名称</Option>
                                <Option value="bookName">对应动画书名称</Option>
                            </Select>
                            <Input.Search
                                placeholder="请输入搜索内容"
                                style={{ width: '80%' }}
                                onChange={(e) => { this.setState({ searchTypeValue: e.target.value }) }}
                                onSearch={value => this.getAudioList(1)}
                                enterButton
                            />
                        </Input.Group>
                        <Table
                            loading={audioListLodaing}
                            columns={columns}
                            dataSource={audioList}
                            pagination={{
                                total: audioTotal,
                                current: this.state.pageIndex,
                                pageSize: this.state.pageSize,
                                onChange: (pageIndex, pageSize) => {
                                    this.getAudioList(pageIndex, pageSize);
                                },
                                onShowSizeChange: (pageIndex, pageSize) => {
                                    this.getAudioList(pageIndex, pageSize);
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
                            scroll={{ y: 440 }}
                        />
                    </div>
                    <div className={styles.block}></div>

                </Modal>
            </div >
        )
    }
}
