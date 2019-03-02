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
export default class Company extends PureComponent {

    getList(args) {
        this.props.form.validateFields((err, values) => {
            this.props.dispatch({
                type: 'approval/getPartnerShareRatioApplies',
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

        const { approval: { loading, partnerApplies, partnerCache } } = this.props;

        const toolBar = (
            <Form layout='inline' className={styles.search_line}>
                <FormItem>
                    {getFieldDecorator('auditStatus', {
                        initialValue: _.get(partnerCache, 'auditStatus', 'TO_AUDIT'),
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
            title: '合伙人名称',
            dataIndex: 'partnerName'
        }, {
            title: '合伙人手机号',
            dataIndex: 'phone'
        }, {
            title: '申请人',
            dataIndex: 'applyUser'
        }, {
            title: '申请内容',
            dataIndex: 'toRatio',
            render(text) {
                return `调整公司分成比例为${text}%`
            }
        }, {
            title: '最后操作事件',
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
                    <Link to={`/approval/partner_divide_detail?id=${record.id}&partnerUid=${record.partnerUid}`}>
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
                    dataSource={_.get(partnerApplies, 'partnerShareRatioApplies', [])}
                    size="small"
                    bordered
                    footer={() => {
                        return `条目： ${_.get(partnerApplies, 'count', 0)}`
                    }}
                    pagination={{
                        total: _.get(partnerApplies, 'count', 0),
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
