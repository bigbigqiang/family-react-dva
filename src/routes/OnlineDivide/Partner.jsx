import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, DatePicker, Input, Button, Icon, Row, Col, Popconfirm, Form } from 'antd';
import moment from 'moment';
import styles from './styles.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;

@connect(state => ({
    divide: state.divide
}))
@Form.create()
export default class Company extends PureComponent {

    getList(args) {
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type: 'divide/getPartnerReportForm',
                payload: {
                    ...values,
                    datePattern: values.date.format('YYYY年MM月'),
                    ...args,
                }
            })
        });
    }

    exportExcel() {
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type: 'divide/exportPartnerReportForm',
                payload: {
                    ...values,
                    datePattern: values.date.format('YYYY年MM月'),
                }
            })
        });
    }

    componentDidMount() {
        this.getList({
            pageNo: 1,
            pageSize: 10
        })
    }

    render() {

        const that = this;

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        let { divide: {
            partnerReport,
            partnerCache,
            loading
        } } = this.props;

        const columns = [{
            title: '合伙人名称',
            dataIndex: 'partnerName'
        }, {
            title: '手机号',
            dataIndex: 'phone',
            width: 120
        }, {
            title: '幼儿园数量',
            dataIndex: 'kindergartenNumber',
            render(text, record) {
                return (
                    <Link to={"/divide/garden?phone=" + record.phone} >
                        <Button type="primary"> {text}</Button>
                    </Link >
                )
            }
        }, {
            title: '本月总收入(元)',
            dataIndex: 'monthTotalEarning'
        }, {
            title: '合伙人收益(元)',
            dataIndex: 'partnerEarning'
        }, {
            title: '幼儿园收益',
            dataIndex: 'kindergartenEarning'
        }, {
            title: '公司分成比例',
            dataIndex: 'corpRatio',
            render(text) {
                return text ? `${text}%` : '-'
            }
        }, {
            title: '下月生效比例',
            dataIndex: 'corpExpectRatio',
            render(text) {
                return text ? `${text}%` : '-'
            }
        }, {
            title: '操作',
            width: 75,
            render(text, record, index) {
                return (
                    <Link to={`/divide/partner_detail?partnerUid=${record.partnerUid}`}>
                        <Button type="primary"><Icon type="edit" />编辑</Button>
                    </Link>
                )
            }
        }].map(item => {
            item.align = 'center';
            return item;
        })

        const toolBar = (
            <Form layout='inline' className={styles.search_line}>
                <FormItem>
                    {getFieldDecorator('parameter')(
                        <Input placeholder="可以搜索合伙人姓名或手机号"></Input>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('date', {
                        initialValue: moment(),
                        rules: [{ required: true, message: '请先选择月份' }],
                    })(
                        <MonthPicker allowClear={false} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={() => {
                        this.getList({
                            pageNo: 1,
                            pageSize: 10
                        });
                    }}>
                        搜索
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={() => {
                        this.props.form.resetFields();
                        this.props.dispatch({
                            type: 'divide/setData',
                            payload: {
                                partnerCache: null
                            }
                        })
                    }}>
                        重置
                    </Button>
                </FormItem>
                <FormItem>
                    <Popconfirm title="是否下载导出数据?" onConfirm={() => {
                        this.exportExcel();
                    }} okText="确认" cancelText="取消">
                        <Button type="primary">
                            <Icon type="download" />数据导出
                        </Button>
                    </Popconfirm>
                </FormItem>
            </Form>
        )

        return (
            <Spin spinning={loading}>
                {toolBar}
                <Table
                    rowKey='partnerUid'
                    size="small"
                    columns={columns}
                    dataSource={_.get(partnerReport, 'partnerReportFormTemplates', [])}
                    bordered
                    footer={() => {
                        return `报表总数： ${_.get(partnerReport, 'count', 0)}`
                    }}
                    pagination={{
                        total: _.get(partnerReport, 'count', 0),
                        size: "small",
                        current: _.get(partnerCache, 'pageNo', 1),
                        pageSize: _.get(partnerCache, 'pageSize', 10),
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: (pageNo, pageSize) => {
                            that.getList({
                                pageNo,
                                pageSize
                            })
                        },
                        onShowSizeChange: (pageNo, pageSize) => {
                            that.getList({
                                pageNo,
                                pageSize
                            })
                        }
                    }}
                />
            </Spin>
        )
    }

}
