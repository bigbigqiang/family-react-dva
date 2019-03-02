import { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Table, DatePicker, Button, Icon, Row, Col, Popconfirm, Form } from 'antd';
import moment from 'moment';
import styles from './styles.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
@connect(state => ({
    divide: state.divide
}))
export default class Company extends PureComponent {

    state = {
        selectedDate: moment()
    }

    getList(args) {
        this.props.dispatch({
            type: 'divide/getCorpReportForm',
            payload: {
                ...args,
            }
        })
    }

    exportExcel() {
        this.props.dispatch({
            type: 'divide/exportCorpReportForm',
            payload: {
                datePattern: moment(this.state.selectedDate).format('YYYY年MM月')
            }
        })
    }

    componentDidMount() {
        console.log(moment().format('YYYY年MM月'))
        this.getList({
            datePattern: moment().format('YYYY年MM月'),
            pageNo: 1,
            pageSize: 10,
        })
    }

    render() {

        const that = this;

        let { divide: {
            corpReport,
            loading
        } } = this.props;

        const columns = [{
            title: '日期',
            dataIndex: 'statisticTime',
            width: 100,
            render(text, record, index) {
                return moment(text).format('MM月DD日')
            }
        }, {
            title: '当天总收入(元)',
            dataIndex: 'totleEarning',
            render(text) {
                return text
            }
        }, {
            title: '安卓渠道收入(元)',
            dataIndex: 'androidTotleEarning',
            render(text) {
                return text
            }
        }, {
            title: '苹果渠道收入(元)',
            dataIndex: 'appleTotleEarning',
            render(text) {
                return text
            }
        }, {
            title: '合伙人收益(元)',
            dataIndex: 'partnerEarning',
            render(text) {
                return text
            }
        }, {
            title: '幼儿园收益(元)',
            dataIndex: 'kindergartenEarning',
            render(text) {
                return text
            }
        }, {
            title: '公司收益(元)',
            dataIndex: 'corpEarning',
            render(text) {
                return text
            }
        }].map(item => {
            item.align = 'center';
            return item;
        })

        const toolBar = (
            <Form layout='inline' className={styles.search_line}>
                <FormItem>
                    <MonthPicker
                        defaultValue={moment()}
                        onChange={(date, dateString) => {
                            that.setState({
                                selectedDate: date
                            })
                            that.getList({
                                datePattern: date.format('YYYY年MM月')
                            });
                        }}
                    />
                </FormItem>
                <FormItem>
                    <Popconfirm title="是否下载导出数据?" onConfirm={() => {
                        that.exportExcel();
                    }} okText="确认" cancelText="取消">
                        <Button type="primary" onClick={() => {
                            console.log('按钮')
                        }}>
                            <Icon type="download" />数据导出
                        </Button>
                    </Popconfirm>
                </FormItem>
                <FormItem>
                    本月合计收入：{_.get(corpReport, 'accumulativeEarning')} 元
                </FormItem>
                <FormItem>
                    公司本月可得收益：{_.get(corpReport, 'corpAccumulativeEarning')} 元
                </FormItem>
            </Form>
        )

        return (
            <Spin spinning={false}>
                {toolBar}
                <Table
                    rowKey={'statisticTime'}
                    columns={columns}
                    dataSource={_.get(corpReport, 'corpReportFormTemplates', [])}
                    size="small"
                    bordered
                    footer={() => {
                        return `报表总数： ${_.get(corpReport, 'totalPageNo', 0)}`
                    }}
                    pagination={{
                        total: _.get(corpReport, 'totalPageNo', 0),
                        size: "small",
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
