import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Spin } from 'antd';
import { dict } from '../../utils/dict';
import styles from './SensitiveWords.less';
import moment from 'moment';

@connect(state => ({
    sensitivewords: state.sensitivewords
}))
export default class SensitiveWord extends Component {

    constructor() {
        super();
        this.state = {
            addSensitiveWords: null
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'sensitivewords/searchWord',
            payload: {
                sensitiveName: '',
            }
        })
    }

    render() {
        const { dispatch } = this.props;
        const { sensitivewords } = this.props;
        const { sensitiveWordsList, loading } = sensitivewords;
        const toolbar = (
            <div className={styles.tool_bar}>
                <Input.Search
                    style={{ width: 300 }}
                    enterButton={true}
                    maxLength={11}
                    placeholder="搜索敏感词"
                    onSearch={(values) => {
                        dispatch({
                            type: 'sensitivewords/searchWord',
                            payload: {
                                sensitiveName: values
                            }
                        })
                    }}
                ></Input.Search>
                <Button onClick={() => { this.setState({ visible: true }); }} type='primary' className={styles.rightButton}><Icon type="plus-circle" />添加敏感词</Button>
            </div >
        )
        // console.log(this.state.addSensitiveWords)
        return (
            <Spin spinning={loading}>
                <div className={styles.sensitiveWords}>
                    {toolbar}
                    <Modal
                        title="添加敏感词"
                        destroyOnClose={true}
                        visible={this.state.visible}
                        onOk={() => {
                            dispatch({
                                type: 'sensitivewords/addWord',
                                payload: {
                                    sensitiveWords: this.state.addSensitiveWords
                                }
                            })
                            this.setState({ visible: false, addSensitiveWords: null })
                        }}
                        onCancel={() => { this.setState({ visible: false, addSensitiveWords: null }) }}
                    >
                        <Input.TextArea placeholder={'请输入敏感词'} rows={4} onChange={(e) => { this.setState({ addSensitiveWords: e.target.value.replace(/\n/g, ',') }); }} />
                        <p style={{ color: '#bbb', textAlign: 'right' }}>支持一次输入多个敏感词，每行一个或逗号(英文逗号)隔开</p>
                    </Modal>
                    <div>
                        {
                            sensitiveWordsList.map((item, index) => (
                                <Tag
                                    style={{ marginBottom: 10 }}
                                    key={index}
                                    closable
                                    onClose={(v) => {
                                        dispatch({
                                            type: 'sensitivewords/deleteWord',
                                            payload: {
                                                sensitiveCode: item.sensitiveCode
                                            }
                                        })
                                    }}
                                    color='#38b8b7'>
                                    {item.sensitiveName}
                                </Tag>
                            ))
                        }
                    </div>
                </div>
            </Spin>
        )
    }
}
