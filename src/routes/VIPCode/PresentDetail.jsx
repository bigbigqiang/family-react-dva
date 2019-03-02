import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Table, Icon, Form, Select, Input } from 'antd';
import { getParameter } from '../../utils/urlHandle.js';
import { dict } from '../../utils/dict';
import styles from './PresentDetail.less'
import moment from 'moment'
const { Search } = Input;
const { Option } = Select;

@connect(state => ({
    vipsend: state.vipsend
}))
@Form.create()
export default class PresentDetail extends PureComponent {

    getBatchDetailList(pageIndex, pageSize) {
        // TODO:
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'vipsend/getVipDetailList',
                    payload: {
                        ...values,// 搜索类型和搜索值
                        "batch": getParameter().batch,
                        "pageIndex": pageIndex,
                        "pageSize": pageSize,
                    }
                })
            }
        })
    }

    componentDidMount() {
        this.getBatchDetailList(1, 10)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { vipsend: { detailLoading, detailCount, detailList } } = this.props;
        const args = getParameter();

        const toolbar = (
            <Form layout='inline'>
                <Row
                    className={styles.search_line}
                    gutter={8}
                >
                    <Col span={8}>
                        {getFieldDecorator('search', {
                            initialValue: '',
                        })(
                            <Search
                                placeholder="搜索"
                                onSearch={(values) => {
                                    this.getBatchDetailList(1, 10)
                                }}
                                enterButton
                            />
                        )}
                    </Col>
                    <Col className={styles.batch_code}>
                        当前批次：<span>{args.batch}</span>
                    </Col>
                </Row>
            </Form>
        )
        const bachBtn = (
            <Row>
                <Col>
                    <Link to="/vipcode/present_list?type=back">
                        <Button><Icon type="left" />返回VIP管理</Button>
                    </Link>
                </Col>
            </Row>
        )

        const tableColumns = [
            {
                title: '账号',
                dataIndex: 'mobile',
                key: 'mobile',
            }, {
                title: '注册时间',
                dataIndex: 'registTime',
                key: 'registTime',
                render: (text, record, index) => {
                    let result = new Date(text);
                    return record.status == 'UNREGISTERED' ? '-' : <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                }
            }, {
                title: 'VIP到期时间',
                dataIndex: 'vipEndTime',
                key: 'vipEndTime',
                render: (text, record, index) => {
                    let result = new Date(text);
                    return record.status == 'UNREGISTERED' ? '-' : <span title={moment(result).format('YYYY-MM-DD HH:mm:ss')}>{moment(result).format('YYYY-MM-DD')}</span>
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => {
                    return dict('VIP_' + text)
                }
            }
        ]

        for (var key in tableColumns) {
            tableColumns[key].align = 'center'
        }

        return (
            <div>
                {bachBtn}
                {toolbar}
                <Table
                    size="small"
                    rowKey="mobile"
                    columns={tableColumns}
                    dataSource={detailList}
                    loading={detailLoading}
                    footer={() => { return `共有数据：${detailCount}条` }}
                    bordered
                    pagination={{
                        total: detailCount,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            this.getBatchDetailList(page, pageSize)
                        },
                        onShowSizeChange: (current, size) => {
                            this.getBatchDetailList(current, size)
                        }
                    }}
                >
                </Table>
            </div>
        )
    }
}
