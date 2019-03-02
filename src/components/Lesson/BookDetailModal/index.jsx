import React, { Component } from 'react';
import { Icon, Modal, Row, Col, Input, Tag } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TextArea } = Input;
import lodash from 'lodash';
@connect(state => ({
    lesson: state.lesson
}))
export default class BookDetailModal extends Component {

    render() {
        const { lesson: { bookInfo } } = this.props;
        //console.log('图书名称:',bookInfo);
        let data = { ...bookInfo }

        let tags = _.get(bookInfo, 'tag', '').split(',');

        return (
            < Modal
                destroyOnClose={true}
                title={'《' + data.bookName + '》 图书详情'}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                footer={false} >
                <Row >
                    <Col span={12}>
                        适用年级:{data.gradeName}
                    </Col>
                    <Col span={12}>
                        阅读时长:预计{data.bookPages}分钟
                    </Col>
                </Row>
                <Row>
                    <div>
                        内容标签:
                        {
                            tags.map((item, index) => {
                                return (<Tag className={styles.tag} key={index}>{item}</Tag>)
                            })
                        }
                    </div>
                </Row>
                <Row>内容简介:</Row>
                <Row>
                    <div>
                        {data.bookIntroduction}
                    </div>
                </Row>
            </Modal >
        )
    }
}