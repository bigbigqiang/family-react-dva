import React, { Component } from 'react';
import { Icon, Modal, Row, Col, Input, Button, Checkbox, message } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
const { TextArea } = Input;
@connect(state => ({
    lesson: state.lesson
}))
export default class WorkModal extends Component {
    render() {
        let { lesson: { workList }, bookCode, isKinder } = this.props;
        let workDomList = {};
        if (workList) {
            workDomList = workList.map((item, index) => {
                return (
                    <div className={styles.row} key={index}>
                        <Checkbox defaultChecked={item.bookCode != null} onChange={(e) => {
                            workList.map((obj, index) => {
                                if (obj.taskType == item.taskType) {
                                    obj.bookCode = e.target.checked;
                                }
                            })
                        }} className={styles.chkbox} disabled={isKinder}>
                            <Row>
                                <Col span={6} className={styles.right}>
                                    作业类型:
                                    </Col>
                                <Col span={18}>
                                    {item.taskType == 'photo' ? '拍照' : item.taskType == 'voice' ? '语音' : '其他'}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} className={styles.right}>
                                    作业内容:</Col>
                                <Col span={18}>
                                    <TextArea
                                        defaultValue={item.taskContent}
                                        autosize={{ minRows: 2 }}
                                        onChange={(e) => {
                                            workList.map((obj, index) => {
                                                if (obj.taskType == item.taskType) {
                                                    obj.taskContent = e.target.value;
                                                }
                                            })
                                        }} disabled={isKinder}>

                                    </TextArea>
                                </Col>
                            </Row>
                        </Checkbox>
                    </div>
                )
            })
        }
        const handleOk = (bk, workList) => {
            let contents = []
            workList.map((item) => {
                if (item.bookCode) {
                    contents.push({
                        type: item.taskType,
                        content: item.taskContent
                    })
                }
            })
            if (!isKinder) {
                if (contents.length > 0) {
                    this.props.dispatch({
                        type: 'lesson/setBookWork',
                        payload: {
                            bookCode: bk,
                            contents: contents
                        }
                    })
                } else message.error('选中某项作业才可以提交哦!')
            }
            else message.error('运营人员才可以修改哦!')
        }
        return (
            <Modal
                destroyOnClose={true}
                title={'作业'}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                footer={
                    <Button key="submit" type="primary" onClick={() => handleOk(bookCode, workList)}>
                        确认
                    </Button>
                }>
                {workDomList}
            </Modal>
        )
    }
}