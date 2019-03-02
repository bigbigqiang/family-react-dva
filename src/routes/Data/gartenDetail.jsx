import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, DatePicker, Modal } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { Link } from 'dva/router';
import { SendTask, ActiveParent, FinishTask } from '../../components/Data'
import { cacheManager } from '../../utils/utils';
import moment from 'moment';
import styles from './gartenDetail.less';

@connect(state => ({
    data: state.data
}))
@Form.create()
export default class gartenDetail extends PureComponent {

    state = {
        nowGarden: '',         // 园所登录时，以缓存中CGC为准，运营人员登录的时候，使用这个
        targetClass: {},
        showUploader: false,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        showSendTeacher: false,
        showActiveParent: false,
        showFinishTask: false
    }

    getGartenDetail() {

        const businessCode = getParameter('businessCode');

        if (businessCode) {
            this.props.dispatch({
                type: 'data/garenDetailData',
                payload: {
                    kindergartenCode: businessCode,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                    // graduateFlag: true
                }
            })
            return false;
        }


    }
    exportClassData() {
        const businessCode = getParameter('businessCode');
        this.props.dispatch({
            type: "data/exportClassData",
            payload: {
                kindergartenCode: businessCode,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }
        });
    }


    componentDidMount() {
        this.getGartenDetail();
    }

    render() {
        // 获取幼儿园Code
        const businessCode = getParameter('businessCode');  // 运营人员从其它页面跳转过来的情况
        const gardenName = getParameter('gardenName');  // 运营人员从其它页面跳转过来的情况
        const CGC = cacheManager.get('ellahome_CGC');   // 园所登录之后的值
        let gardenCode = this.state.nowGarden || CGC || businessCode;       // 运营人员登录后，搜索之后，设置的值

        let {
            data: {
                listLoading,
                gartenDetails,
                classStudent,
                activeMom,
                finishMom,
                exClassData

            }
        } = this.props;

        const { RangePicker } = DatePicker;
        const dateFormat = "YYYY-MM-DD";

        // 定义列表字段
        const columns = [
            {
                title: '班级',
                dataIndex: 'className',
                key: 'className'
            }, {
                title: '年级',
                dataIndex: 'gradeName',
                key: 'gradeName',
            }, {
                title: '课程卡',
                dataIndex: 'vipCardNum',
                key: 'vipCardNum',

            }, {
                title: '教师',
                dataIndex: 'teacherNum',
                key: 'teacherNum',

            }, {
                title: '发送作业',
                dataIndex: 'sendHomeTaskNum',
                key: 'sendHomeTaskNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.setState({
                                    showSendTeacher: true
                                });
                                this.props.dispatch({
                                    type: 'data/sendTaskData',
                                    payload: {
                                        classCode: this.state.targetClass.classCode,
                                        startDate: this.state.startDate,
                                        endDate: this.state.endDate
                                        // classCode: 'HC20180321172940788194',
                                        // startDate:'2018-04-10',
                                        // endDate: '2018-07-16'
                                    }
                                })
                            })

                        }}>
                            {record.sendHomeTaskNum}
                        </a>
                    )
                }
            }, {
                title: '作业评论',
                dataIndex: 'homeTaskCommentNum',
                key: 'homeTaskCommentNum',
            }, {
                title: '家长',
                dataIndex: 'parentNum',
                key: 'parentNum',

            }, {
                title: '活跃家长',
                dataIndex: 'activeParentNum',
                key: 'activeParentNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.setState({
                                    showActiveParent: true
                                });
                                this.props.dispatch({
                                    type: 'data/activeParents',
                                    payload: {
                                        classCode: this.state.targetClass.classCode,
                                        startDate: this.state.startDate,
                                        endDate: this.state.endDate
                                        // classCode: 'HC20180321172940788194',
                                        // startDate:'2018-04-10',
                                        // endDate: '2018-07-16'
                                    }
                                })
                            })

                        }}>
                            {record.activeParentNum}
                        </a>
                    )
                }
            },
            {
                title: '完成作业家长',
                dataIndex: 'performHomeTaskParentNum',
                key: 'performHomeTaskParentNum',
                className: styles.amount,
                render: (text, record) => {
                    return (
                        <a onClick={() => {
                            this.setState({
                                targetClass: record,
                            }, () => {
                                this.setState({
                                    showFinishTask: true
                                });
                                this.props.dispatch({
                                    type: 'data/finishTask',
                                    payload: {
                                        classCode: this.state.targetClass.classCode,
                                        startDate: this.state.startDate,
                                        endDate: this.state.endDate
                                        // classCode: 'HC20180321172940788194',
                                        // startDate:'2018-04-10',
                                        // endDate: '2018-07-16'
                                    }
                                })
                            })

                        }}>
                            {record.performHomeTaskParentNum}
                        </a>
                    )
                }
            },
            {
                title: '家长看书',
                dataIndex: 'parentReadBookNum',
                key: 'parentReadBookNum',
            }
        ]

        return (
            <div>
                <Row className={styles.search_line}>
                    <Col>
                        <Button type="default">
                            <Link to='./use_data?type=back'>
                                <Icon type="left" />返回使用数据
                            </Link >
                        </Button>
                    </Col>

                    <Col className={styles.rightButton}>
                        <RangePicker
                            defaultValue={[moment(), moment()]}
                            format={dateFormat}
                            onChange={(value) => {
                                this.setState({
                                    startDate: value[0].format("YYYY-MM-DD"),
                                    endDate: value[1].format("YYYY-MM-DD")
                                });
                                setTimeout(() => this.getGartenDetail(), 200);
                            }}
                        />
                        <Button type="primary" onClick={() => {
                            this.setState({
                                showUploader: true
                            });
                            this.exportClassData()
                        }}>
                            <Icon type="download" />导出
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            loading={listLoading}
                            columns={columns}
                            className={styles.kinder_garden_list}
                            dataSource={gartenDetails}
                            bordered
                            pagination={{
                                size: "small",
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                            footer={() => {
                                // return `班级： ${_.get(classList, 'length', 0)}`
                            }}
                        />
                    </Col>
                </Row>
                <SendTask
                    visible={this.state.showSendTeacher}
                    studentData={classStudent}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.setState({
                            showSendTeacher: false
                        })
                    }}

                />
                <ActiveParent
                    visible={this.state.showActiveParent}
                    parentData={activeMom}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.setState({
                            showActiveParent: false
                        })
                    }}
                />
                <FinishTask
                    visible={this.state.showFinishTask}
                    finishData={finishMom}
                    targetClass={this.state.targetClass}
                    onCancel={() => {
                        this.setState({
                            showFinishTask: false
                        })
                    }}
                />
                <Modal visible={this.state.showUploader}
                    onOk={() => {
                        this.setState({
                            showUploader: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            showUploader: false
                        })
                    }}>
                    <Form className={styles.upload_form}>
                        <a className="title" target='blank' href={exClassData == undefined ? "###" : exClassData.downloadUrl}>   <Button><Icon type="download" />点击下载数据
                        </Button></a>
                    </Form>
                </Modal>
            </div>
        )
    }
}
