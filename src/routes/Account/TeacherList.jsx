import React, { PureComponent } from 'react';
import { Row, Col, Table, Button, Icon, Form, Input, Select, AutoComplete, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import { getParameter } from '../../utils/utils';
import { Link, routerRedux } from 'dva/router';
import { TeacherEdit, MultipleAdd } from '../../components/Account'
import moment from 'moment';
import { server, cacheManager } from '../../utils/utils';
import styles from './ClassList.less';

const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    garden: state.garden,
    teacher: state.teacher
}))
export default class TeacherList extends PureComponent {

    state = {
        nowGarden: '',         // 园所登录时，以缓存中CGC为准，运营人员登录的时候，使用这个
        showUploader: false
    }

    getTeachers(data) {

        const businessCode = getParameter('businessCode');
        let CGC = cacheManager.get('ellahome_CGC');

        if (CGC) {
            this.props.dispatch({
                type: 'teacher/fetch',
                payload: {
                    kindergartenCode: CGC,
                    graduateFlag: true
                }
            })
            return false;
        } else if (data) {
            this.props.dispatch({
                type: 'teacher/fetch',
                payload: {
                    ...data,
                    kindergartenCode: data.kindergartenCode || businessCode || null
                }
            })
        } else {
            this.props.dispatch({
                type: 'teacher/fetch',
                payload: businessCode ? {
                    kindergartenCode: businessCode
                } : null
            })
        }

    }

    getTheTeacherInfo(payload) {
        this.props.dispatch({
            type: 'teacher/getTheTeacherInfo',
            payload
        })
    }

    componentDidMount() {
        // this.props.dispatch({
        //     type: 'garden/setData',
        //     payload: {
        //         cacheFilter: null
        //     }
        // })
        this.getTeachers();
    }

    render() {

        const businessCode = getParameter('businessCode');  // 运营人员从其它页面跳转过来的情况
        const gardenName = getParameter('gardenName');  // 运营人员从其它页面跳转过来的情况
        const routeFrom = getParameter('from');

        // 园所登录之后的值
        const CGC = cacheManager.get('ellahome_CGC');
        let gardenCode = this.state.nowGarden || CGC || businessCode;

        const columns = [
            {
                title: '教师姓名',
                dataIndex: 'teacherName',
                key: 'teacherName'
            }, {
                title: '所在班级',
                dataIndex: 'className',
                key: 'className',
                render(text) {
                    return text || '-'
                }
            }, {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 102
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
                render: (text, record) => {
                    let result = new Date(record.createTime * 1);
                    return (
                        <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                    )
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 148,
                render: (text, record) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => {
                                //打开弹窗，并存储当前用户Code，用来设置role
                                this.getTheTeacherInfo({
                                    uid: record.uid,
                                    gardenCode: gardenCode
                                })
                            }}><Icon type="edit" theme="outlined" />编辑</Button>
                            <Popconfirm title="请问是否确定要删除该账户?" onConfirm={() => {
                                // console.log(record)
                                this.props.dispatch({
                                    type: 'teacher/deleteTheTeacher',
                                    payload: {
                                        uid: record.uid,
                                        kindergartenCode: record.kindergartenCode
                                    }
                                })
                            }} okText="是" cancelText="否">
                                <Button type="primary" className={styles.adds} ><Icon type="delete" theme="outlined" />删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]

        for (var key in columns) {
            columns[key].align = 'center'
        }

        let { teacher: {
            teacherData,        // 指定幼儿园的 教师列表
            theTeacher,         //  编辑教师时，获取的当前教师的详细信息
            showModal,
            listLoading,
            modalLoading
        } } = this.props;

        // 链接garden model 用于搜索指定幼儿园
        let { garden: {
            gardens, // 幼儿园列表
        } } = this.props;
        console.log(gardens)

        let searchTimeout = null;

        const gardenOptions = _.get(gardens, 'kindergartenList', []).map(item => {
            return <Option key={JSON.stringify({ code: item.kindergartenCode, name: item.kindergartenName })}>{item.kindergartenName}</Option>
        })

        const toolbar = (
            <Form layout='inline'>
                <Row type="flex" justify="space-between" className={styles.search_line}>
                    {businessCode ? <Col>
                        <Button type="default">
                            <Link to={`/account/${routeFrom}?type=back`}>
                                <Icon type="left" />返回幼儿园管理
                            </Link>
                        </Button>
                    </Col> : ''}
                    {!CGC ? <Col span={8}>
                        <AutoComplete
                            placeholder={businessCode ? `当前幼儿园 : ${window.decodeURI(gardenName)}` : "请先搜索并选定幼儿园"}
                            onChange={(values) => {
                                let arg = '';
                                try {
                                    values = JSON.parse(values);
                                } catch (err) {

                                }
                                if (typeof values == 'string') {
                                    arg = values.replace(/\'/g, '');
                                } else if (typeof values == 'number') {

                                } else {
                                    arg = values.name.replace(/\'/g, '')
                                }
                                clearTimeout(searchTimeout)
                                searchTimeout = setTimeout(() => {
                                    this.props.dispatch({
                                        type: 'garden/fetch',
                                        payload: {
                                            searchParam: arg,
                                        }
                                    })
                                }, 300)
                            }}
                            onSelect={(values) => {
                                values = JSON.parse(values);
                                this.setState({
                                    nowGarden: values.code
                                })
                                this.getTeachers({
                                    kindergartenCode: values.code,
                                })
                                // this.props.dispatch(routerRedux.push(`/account/teacher?businessCode=${values.code}&gardenName=${values.name}`))
                            }}
                            enterButton
                        >
                            {gardenOptions}
                        </AutoComplete>
                    </Col> : ''}
                    <Col className={styles.rightButton}>
                        <Button.Group>
                            <Button type="primary" onClick={() => {
                                if (gardenCode) {
                                    this.getTheTeacherInfo({
                                        gardenCode: gardenCode
                                    })
                                } else {
                                    message.warn('请先搜索幼儿园')
                                }
                            }}>
                                <Icon type="plus-circle-o" />添加教师
                            </Button>
                            <Button type="primary" onClick={() => {
                                if (gardenCode) {
                                    this.setState({
                                        showUploader: true
                                    })
                                } else {
                                    message.warn('请先搜索幼儿园')
                                }
                            }}>
                                <Icon type="plus-circle-o" />批量导入
                            </Button>
                        </Button.Group>
                    </Col>
                </Row>
            </Form>
        )

        return (
            <div>
                {toolbar}
                <Row>
                    <Col>
                        <Table
                            rowKey="id"
                            size="small"
                            loading={listLoading}
                            columns={columns}
                            dataSource={teacherData}
                            className={styles.kinder_garden_list}
                            bordered
                            pagination={{
                                size: "small",
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                            footer={() => { return `老师：${teacherData.length}` }}
                        />
                    </Col>
                </Row>
                <TeacherEdit
                    visible={showModal}
                    loading={modalLoading}
                    theTeacher={theTeacher}
                    onOk={(data) => {
                        let payload = {
                            ...data,
                            kindergartenCode: gardenCode
                        }
                        this.props.dispatch({
                            type: 'teacher/setTheTeacher',
                            payload
                        })
                        // TODO: 下周接着写这个，
                    }}
                    onCancel={() => {
                        this.props.dispatch({
                            type: 'teacher/setData',
                            payload: { showModal: false }
                        })
                    }}
                />
                <MultipleAdd
                    visible={this.state.showUploader}
                    uploadText={'选择教师Excel文件进行批量上传'}
                    downloadText={'点击下载教师模板'}
                    uploadUrl={`${server.serverPath}/rest/importExcel/importTeacher`}
                    downloadUrl={`${server.serverPath}/rest/importExcel/downloadTeacherTemplate`}
                    meta={{
                        fileCode: gardenCode
                    }}
                    onCancel={() => {
                        this.setState({
                            showUploader: false
                        })
                    }}
                    onSuccess={() => {
                        this.setState({
                            showUploader: false
                        })
                        this.getTeachers();
                    }}
                />
            </div>
        )
    }
}
