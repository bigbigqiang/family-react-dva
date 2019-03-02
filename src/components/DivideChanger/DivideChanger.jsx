import { PureComponent } from 'react'
import { Modal, InputNumber, Row, Col } from 'antd';

export default class DivideChanger extends PureComponent {

    state = {
        shareRatio: null
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                title={this.props.title}
                destroyOnClose={true}
                onOk={() => {
                    try {
                        this.props.onOk(this.state.shareRatio)
                    } catch (err) {

                    }
                }}
                onCancel={() => {
                    this.props.onCancel ? this.props.onCancel() : ''
                }}
            >
                <Row>
                    {this.props.description}：<InputNumber min={0} max={100} onChange={(shareRatio) => {
                        this.setState({
                            shareRatio
                        })
                    }} /> %
                </Row>
                <Row>
                    审核通过之后，下月1号生效
                </Row>
                <Row>
                    {this.props.notice}
                </Row>
            </Modal>
        )
    }
}
