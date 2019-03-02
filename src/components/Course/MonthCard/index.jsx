import React, { PureComponent } from 'react';
import { Row, Col, Card, Button, Icon, Popconfirm } from 'antd';
import styles from './index.less';
import lodash from 'lodash';
const { Group: ButtonGroup } = Button;
const { Meta } = Card;

export default class MonthCard extends PureComponent {

    render() {

        const dom = [];

        const { showBookModal, showPlanModal, weekCount, data, handleCourseDelete } = this.props;
        // if (data && data[0]) {
        // 如果月数据存在，并且周数据存在
        // console.log(data)
        for (let index = 0; index < weekCount; index++) {
            dom.push(
                <Col key={index} xxl={6} xl={8} xs={12}>
                    <Card
                        title={`第${index + 1}周`}
                        className={styles.week_card}
                        actions={[
                            <ButtonGroup>
                                {
                                    _.has(data, `${[index]}.course_title`) ?
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                showBookModal({
                                                    week: data[index].week_number,
                                                    course_id: data[index].id
                                                })
                                            }}
                                        >
                                            <Icon type="book" />编辑课程
                                        </Button>
                                        :
                                        <Button
                                            type="default"
                                            onClick={() => {
                                                showBookModal({
                                                    week: index + 1,
                                                })
                                            }}
                                        >
                                            <Icon type="plus-circle-o" />添加课程
                                        </Button>
                                }
                                {
                                    // 编辑，则可以用后端传过来的周。。。
                                    // 新增，则使用index+1作为周信息
                                    // 必须已经有书，有教案，才可以编辑，
                                    // 必须已经有书，没有教案，才可以添加
                                    //        没有书，肯定没有教案，显示先添加书
                                    _.get(data, `${[index]}.courseType`) === 'IN' ?
                                        data[index] && data[index].has_plan && data[index].book_code ?
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    showPlanModal({
                                                        week: index + 1,
                                                        bookCode: data[index].book_code,
                                                    })
                                                }}
                                            >
                                                <Icon type="edit" />编辑教案
                                            </Button> :
                                            < Button
                                                type="default"
                                                disabled={!data[index] || !data[index].book_code}
                                                onClick={() => {
                                                    showPlanModal({
                                                        week: index + 1,
                                                        bookCode: data[index].book_code,
                                                    })
                                                }}
                                            >
                                                <Icon type="plus-circle-o" />添加教案
                                            </Button> : ''
                                }
                                {
                                    _.has(data, `${[index]}.course_title`) ?
                                        <Popconfirm title="请问是否确定删除该课程?" onConfirm={() => {
                                            handleCourseDelete({
                                                course_id: data[index].id
                                            })
                                        }} okText="是" cancelText="否">
                                            <Button type="primary">
                                                <Icon type="delete" />删除课程
                                            </Button>
                                        </Popconfirm>
                                        : ''
                                }
                            </ButtonGroup>
                        ]}>
                        <Meta
                            title={
                                _.has(data, `${[index]}.course_title`) ?
                                    <span className={styles.has_class_title}>{data[index].course_title}</span> :
                                    <span className={styles.no_class_title}>请先添加课程</span>
                            }
                        />
                    </Card >
                </Col >
            )
        }
        // }

        return (
            <Row gutter={8} >
                {dom}
            </Row>
        )
    }
}