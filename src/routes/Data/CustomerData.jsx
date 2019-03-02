import React, { PureComponent } from "react";
import {
    Row,
    Col,
    Input,
    Button,
    Modal,
    Icon,
    Table,
    DatePicker,
    Menu,
    Form,
} from "antd";
import { connect } from "dva";
import { Link } from "dva/router";
import moment from "moment";
import styles from "./CustomerData.less";
import { getParameter, server,cacheManager } from "../../utils/utils";
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "bizcharts";
import { DataSet } from '@antv/data-set'
import { CumulativeUser, AddUser } from '../../components/Data'
import lodash from 'lodash';
const Search = Input.Search;
const comfirm = Modal.comfirm;

@connect(state => ({
    data: state.data
}))
export default class Partner extends PureComponent {

    state = {
        currentPage: 1,
        current: "mail",
        nowGarden: "",         // 园所登录时，以缓存中CGC为准，运营人员登录的时候，使用这个
        showUploader: false,
        startDate: moment().startOf('month').format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        currentName: "累计用户",
        cumulativeUser: "block",
        addUser: "none"

    }

    getDatas(data) {
        if (data) {
            this.props.dispatch({
                type: "data/fetch",
                payload: {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            });
        } else {
            this.props.dispatch({
                type: "data/fetch",
                payload: null
            });
        }
    }
    getExportDatas() {
        this.props.dispatch({
            type: "data/exportDatas",
            payload: {
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }
        });
    }

    /*导航*/
    handleClick = (e) => {
        this.setState({
            current: e.key
        });
        if (e.key == "mail") {
            this.setState({
                currentName: "累计用户",
                cumulativeUser: "block",
                addUser: "none"
            });
        }
        if (e.key == "app") {
            this.setState({
                currentName: "新增用户",
                cumulativeUser: "none",
                addUser: "block"
            });
        }
        if (e.key == "alipay") {
            this.setState({
                cumulativeUser: "none",
                addUser: "none"
            });

        }

    }

    componentDidMount() {
        this.getDatas(1);
    }

    render() {

        // 获取幼儿园Code
        const businessCode = getParameter("businessCode");  // 运营人员从其它页面跳转过来的情况
        const gardenName = getParameter("gardenName");  // 运营人员从其它页面跳转过来的情况
        const CGC = cacheManager.get("ellahome_CGC");   // 园所登录之后的值
        let gardenCode = this.state.nowGarden || CGC || businessCode;       // 运营人员登录后，搜索之后，设置的值
        const columns = [
            {
                title: "日期",
                dataIndex: "statisticalDate",
                key: "statisticalDate",
                render: (text, record) => {
                    let result = new Date(record.statisticalDate * 1);
                    return (
                        <span
                            title={moment(result).format("YYYY-MM-DD HH:mm:ss")}>{moment(result).format("YYYY-MM-DD")}</span>
                    );
                }
            }, {
                title: "累计用户",
                dataIndex: "cumulativeUser",
                key: "cumulativeUser"
            }, {
                title: "累计教师",
                dataIndex: "cumulativeTeacher",
                key: "cumulativeTeacher"
            }, {
                title: "累计家长",
                dataIndex: "cumulativeParent",
                key: "cumulativeParent"
            }, {
                title: "累计幼儿园",
                dataIndex: "cumulativeKindergarten",
                key: "cumulativeKindergarten"

            }, {
                title: "累计班级",
                dataIndex: "cumulativeClass",
                key: "cumulativeClass"
            }
        ];
        const columns1 = [
            {
                title: "日期",
                dataIndex: "statisticalDate",
                key: "statisticalDate",
                render: (text, record) => {
                    let result = new Date(record.statisticalDate * 1);
                    return (
                        <span
                            title={moment(result).format("YYYY-MM-DD HH:mm:ss")}>{moment(result).format("YYYY-MM-DD")}</span>
                    );
                }
            }, {
                title: "新增用户",
                dataIndex: "addUser",
                key: "addUser"
            }, {
                title: "新增教师",
                dataIndex: "addTeacher",
                key: "addTeacher"
            }, {
                title: "新增家长",
                dataIndex: "addParent",
                key: "addParent"
            }, {
                title: "新增幼儿园",
                dataIndex: "addKindergarten",
                key: "addKindergarten"

            }, {
                title: "新增班级",
                dataIndex: "addClass",
                key: "addClass"

            }
        ];
        const columns2 = [
            {
                title: "日期",
                dataIndex: "statisticalDate",
                key: "statisticalDate",
                render: (text, record) => {
                    // console.log(record);
                    let result = new Date(record.statisticalDate * 1);
                    return (
                        <span
                            title={moment(result).format("YYYY-MM-DD HH:mm:ss")}>{moment(result).format("YYYY-MM-DD")}</span>
                    );
                }
            }, {
                title: "活跃教师",
                dataIndex: "activeTeacher",
                key: "activeTeacher"
            }, {
                title: "活跃家长",
                dataIndex: "activeParent",
                key: "activeParent"
            }, {
                title: "发送作业",
                dataIndex: "sendHomeTask",
                key: "sendHomeTask"

            }
        ];
        //日期控制
        const { RangePicker } = DatePicker;
        const dateFormat = "YYYY-MM-DD";
        const { data: { teacherData, exportData } } = this.props;
        const totalList = (<Table
            size="small"

            dataSource={teacherData}
            columns={columns}
            pagination={{
                current: this.state.currentPage,
                size: "small",
                showSizeChanger: true,
                showQuickJumper: true,
                hideOnSinglePage: true,
                onChange: (page, pageSize) => {
                    this.setState({
                        currentPage: page
                    });
                }
            }}
        >
        </Table>);
        const newList = (<Table
            size="small"
            // loading={formloading}
            dataSource={teacherData}
            columns={columns1}
            pagination={{
                current: this.state.currentPage,
                size: "small",
                showSizeChanger: true,
                showQuickJumper: true,
                hideOnSinglePage: true,
                onChange: (page, pageSize) => {
                    this.setState({
                        currentPage: page
                    });
                    // this.fetchList(page, pageSize)
                }
            }}
        >
        </Table>);
        const activeList = (<Table
            size="small"

            // loading={formloading}
            dataSource={teacherData}
            columns={columns2}
            pagination={{
                current: this.state.currentPage,
                size: "small",
                showSizeChanger: true,
                showQuickJumper: true,
                hideOnSinglePage: true,
                onChange: (page, pageSize) => {
                    this.setState({
                        currentPage: page
                    });
                    // this.fetchList(page, pageSize)
                }
            }}
        >
        </Table>);
        return (
            <div>

                <CumulativeUser
                    visible={this.state.cumulativeUser}
                    teacherData={teacherData}
                 />

                <AddUser
                    visible={this.state.addUser}
                    teacherData={teacherData}
                />
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item key="mail">
                            累计用户
                        </Menu.Item>
                        <Menu.Item key="app">
                            新增用户
                        </Menu.Item>
                        <Menu.Item key="alipay">
                            活跃用户
                        </Menu.Item>
                    </Menu>
                    <Col className={styles.rightButton}>
                        <RangePicker
                            defaultValue={[moment().startOf('month'), moment()]}
                            format={dateFormat}
                            onChange={(value) => {
                                // console.log(value[0])
                                this.setState({
                                    startDate: value[0].format("YYYY-MM-DD"),
                                    endDate: value[1].format("YYYY-MM-DD")


                                });
                                setTimeout(() => this.getDatas(1), 200);
                            }}
                        />
                        <Button type="primary" onClick={() => {
                            this.setState({
                                showUploader: true
                            });
                            this.getExportDatas()
                        }}>
                            <Icon type="download" />导出
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className={styles.dataTable}>

                        {this.state.current === "mail" ? totalList : this.state.current === "app" ? newList : activeList}
                    </Col>
                </Row>
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
                        <a className="title" target='blank' href={exportData == undefined ? "###" : exportData.downloadUrl}>   <Button><Icon type="download" />点击下载数据
                        </Button></a>
                    </Form>
                </Modal>

            </div>

        );
    }
}