import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Spin, Table, Select, Radio, Input, Icon, Form } from 'antd';
import styles from './styles.less';
import { dict } from '../../utils/dict';
import moment from 'moment';

const { Item: FormItem } = Form;
@connect(state => ({
    approval: state.approval
}))
@Form.create()
export default class Garden extends PureComponent {

    getList(args) {
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type: 'approval/getKindergartenShareRatioApplies',
                payload: {
                    ...values,
                    ...args,
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

        const { approval: { loading, gartenApplies, gartenCache } } = this.props;

        const toolBar = (
            <Form layout='inline' className={styles.search_line}>
                <FormItem>
                    {getFieldDecorator('auditStatus', {
                        initialValue: _.get(gartenCache, 'auditStatus', 'TO_AUDIT'),
                    })(
                        <Radio.Group onChange={(e) => {
                            this.getList({
                                auditStatus: e.target.value
                            })
                        }}>
                            <Radio.Button value="TO_AUDIT">待审核</Radio.Button>
                            <Radio.Button value="PASS">已通过</Radio.Button>
                            <Radio.Button value="NO_PASS">未通过</Radio.Button>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('parameter')(
                        <Input.Search enterButton={true} placeholder="可搜索合伙人名称或手机号" onSearch={(e) => { this.getList({ pageNo: 1, pageSize: 10 }) }}></Input.Search>
                    )}
                </FormItem>
            </Form>
        )

        const columns = [{
            title: '幼儿园名称',
            dataIndex: 'kindergartenName'
        }, {
            title: '所属合伙人',
            dataIndex: 'partnerName'
        }, {
            title: '申请人',
            dataIndex: 'applyUser'
        }, {
            title: '申请内容',
            dataIndex: 'toRatio',
            render(text) {
                return `调整园所分成比例为${text}%`
            }
        }, {
            title: '最后操作时间',
            dataIndex: 'updateTime',
            render(text) {
                return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
            }
        }, {
            title: '状态',
            dataIndex: 'auditStatus',
            render(text) {
                return dict(text, {
                    prefix: 'APPROVAL',
                    type: 'badge'
                })
            }
        }, {
            title: '操作',
            render(text, record, index) {
                return (
                    <Link to={`/approval/garden_divide_detail?id=${record.id}&kindergartenCode=${record.kindergartenCode}`}>
                        <Button type="primary"><Icon type="solution" />审批</Button>
                    </Link>
                )
            }
        }].map(item => {
            item.align = 'center';
            return item;
        })

        return (
            <Spin spinning={loading}>
                {toolBar}
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={_.get(gartenApplies, 'kindergartenShareRatioApplies', [])}
                    size="small"
                    bordered
                    footer={() => {
                        return `条目： ${_.get(gartenApplies, 'count', 0)}`
                    }}
                    pagination={{
                        total: _.get(gartenApplies, 'count', 0),
                        size: "small",
                        current: _.get(gartenCache, 'pageNo', 1),
                        pageSize: _.get(gartenCache, 'pageSize', 10),
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
