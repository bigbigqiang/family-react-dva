import { PureComponent } from 'react';
import { Modal, Row, Col, Radio, Input } from 'antd';

const RadioGroup = Radio.Group;
const Search = Input.Search;
export class MessageConfirmModal extends PureComponent {

    state = {
        verifyPhone: '18603862926',
        verifyCode: ''
    }

    render() {

        let handleType = 'turnOn';
        let noticeMsg = `${handleType === 'turnOn' ? '启用' : '停用'}后，该幼儿园的教师${handleType === 'turnOn' ? '可以' : '不能'}登录APP，该重要操作需要进行审核。请选择一位审核人，他将获取验证码，输入验证码，验证通过后可以进行停用操作。`
        let { visible } = this.props;
        return (
            <Modal
                title="短信授权"
                onCancel={this.props.onCancel}
                onOk={() => {
                    this.props.onOk(this.state.verifyPhone, this.state.verifyCode)
                }}
                okText={handleType === 'turnOn' ? '确认启用' : '确认停用'}
                visible={visible}
                destroyOnClose={true}
            >
                <Row>
                    <Col style={{ textIndent: 32 }}>
                        {noticeMsg}
                    </Col>
                </Row>
                <Row style={{ textAlign: 'center' }}>
                    <Col>
                        <RadioGroup defaultValue="18603862926" onChange={e => {
                            this.setState({
                                verifyPhone: e.target.value
                            })
                        }}>
                            <Radio value="18603862926">杨铁军</Radio>
                            <Radio value="13526662204">蔡喆</Radio>
                            <Radio value="15868475409">屠科钻</Radio>
                            <Radio value="13811598854">武维阳</Radio>
                            <Radio value="13857190603">测试</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Search
                            placeholder="请输入验证码"
                            enterButton="获取验证码"
                            onSearch={() => {
                                this.props.sendMessage(this.state.verifyPhone)
                            }}
                            onChange={e => {
                                this.setState({
                                    verifyCode: e.target.value
                                })
                            }}
                        ></Search>
                    </Col>
                </Row>
            </Modal>
        )
    }
}
