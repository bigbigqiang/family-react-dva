import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Modal, Tag, Row, Col, Select, DatePicker, Table, Card, Avatar, } from 'antd';
import { Link } from "dva/router";
import { dict } from '../../utils/dict';
import styles from './InformationType.less';
const { Meta } = Card;

class TextTypeInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.typeInfo}>
                <p>{this.props.content}</p>
                {this.props.bookName && <p className={styles.goToSee}>{`去看《${this.props.bookName}》`}</p>}
            </div>
        )
    }
}
class ImgTypeInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            showImg: ''
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.typeInfo}>
                <Modal
                    // title="Basic Modal"
                    footer={null}
                    visible={this.state.visible}
                    onOk={() => { this.setState({ visible: false }) }}
                    style={{ textAlign: 'center' }}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <img style={{ width: '100%', maxHeight: '100%' }} src={this.state.showImg} alt="" />
                </Modal>
                <p>{this.props.content}</p>
                <div className={styles.imgWrap}>
                    {this.props.imgNum > 0 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[0] }) }} src={this.props.imageList[0]} alt="" />}
                    {this.props.imgNum > 1 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[1] }) }} src={this.props.imageList[1]} alt="" />}
                    {this.props.imgNum > 2 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[2] }) }} src={this.props.imageList[2]} alt="" />}
                </div>
                <div className={styles.imgWrap}>
                    {this.props.imgNum > 3 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[3] }) }} src={this.props.imageList[3]} alt="" />}
                    {this.props.imgNum > 4 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[4] }) }} src={this.props.imageList[4]} alt="" />}
                    {this.props.imgNum > 5 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[5] }) }} src={this.props.imageList[5]} alt="" />}
                </div>
                <div className={styles.imgWrap}>
                    {this.props.imgNum > 6 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[6] }) }} src={this.props.imageList[6]} alt="" />}
                    {this.props.imgNum > 7 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[7] }) }} src={this.props.imageList[7]} alt="" />}
                    {this.props.imgNum > 8 && <img onClick={() => { this.setState({ visible: true, showImg: this.props.imageList[8] }) }} src={this.props.imageList[8]} alt="" />}
                </div>
                {/* <div className={styles.imgWrap}>
                </div> */}
                {this.props.bookName && <p className={styles.goToSee}>{`去看《${this.props.bookName}》`}</p>}
            </div>
        )
    }
}
class VideoTypeInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.typeInfo}>
                <p>{this.props.content}</p>
                <div className={styles.videoWrap}>
                    {/* <video src="http://kindergarten.ellabook.cn/62973144f7ef49e9bf6919c30b2c62b8.mp4" controls></video> */}
                    <video src={this.props.url} controls></video>
                </div>
                {/* <div className={styles.imgWrap}>
                </div> */}
                {this.props.bookName && <p className={styles.goToSee}>{`去看《${this.props.bookName}》`}</p>}
            </div>
        )
    }
}
class AudioTypeInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.typeInfo}>
                <p>{this.props.content}</p>
                <div className={styles.audioWrap}>
                    {/* <audio src="http://kindergarten.ellabook.cn/50fc5a2489764146a9458188c1008812.mp3" controls></audio> */}
                    <audio src={this.props.url} controls></audio>
                </div>
                {/* <div className={styles.imgWrap}>
                </div> */}
                {this.props.bookName && <p className={styles.goToSee}>{`去看《${this.props.bookName}》`}</p>}
            </div>
        )
    }
}
class PublisherInfo extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    componentDidMount() {

    }

    render() {
        const publish = {
            'TEACHER': '教师',
            'PARENT': '家长',
            'HEADMASTER': '园长',
            'SYSTEM': '系统发布',
            'OPERATOR': '运营人员'
        }
        return (
            <div className={styles.typeInfo}>
                <Meta
                    style={{ padding: 20 }}
                    className={styles.publisherInfo}
                    avatar={<Avatar size={80} src={this.props.userIcon} />}
                    title={
                        <div className={styles.titBox}>
                            <p>{this.props.userName}</p>
                            <p>角色:{publish[this.props.publisherType]}</p>
                            <p>手机号:{this.props.phone}</p>
                        </div>
                    }
                    description={
                        <div className={styles.desBox}>
                            <p>所在幼儿园:{this.props.kindergartenName}</p>
                            <p>所在班级:{this.props.kindergartenClass}</p>
                        </div>
                    }
                />
            </div>
        )
    }
}
export { TextTypeInfo as default, TextTypeInfo, ImgTypeInfo, VideoTypeInfo, AudioTypeInfo, PublisherInfo }
