import React, { PureComponent } from 'react';
import { Modal, Transfer } from 'antd';
import lodash from 'lodash';

export default class ClassTeacher extends PureComponent {

    state = {
        dataSource: [],
        targetKeys: []
    }

    componentWillReceiveProps(props) {
        let { teacherData } = this.props;

        let teacherIn = _.get(teacherData, 'teacherIn', []).map(item => {
            return {
                key: item.uid,
                title: item.teacherName + '',
                description: item.teacherName + ' ' + item.phone,
            }
        })

        let teacherNotIn = _.get(teacherData, 'teacherNotIn', []).map(item => {
            return {
                key: item.uid,
                title: item.teacherName + '',
                description: item.teacherName + ' ' + item.phone,
            }
        })

        let dataSource = teacherIn.concat(teacherNotIn)

        let targetKeys = teacherIn.map(item => {
            return item.key
        })

        this.setState({
            dataSource,
            targetKeys,
            lastKeys: targetKeys
        })
    }

    render() {
        let { visible, loading, onOk, onCancel, classData, teacherData } = this.props;

        return (
            <Modal
                visible={visible}
                confirmLoading={loading}
                onOk={() => {
                    let add = _.difference(this.state.targetKeys, this.state.lastKeys) // 增加的值
                    let del = _.difference(this.state.lastKeys, this.state.targetKeys) // 减少的值
                    onOk(classData.classCode, add, del)
                }}
                onCancel={onCancel}
                title={"当前班级：" + classData.className}
                destroyOnClose={true}
            >
                <Transfer
                    dataSource={this.state.dataSource}
                    titles={['其它老师', '在班老师']}
                    targetKeys={this.state.targetKeys}
                    render={item => item.title}
                    onChange={(nextTargetKeys, direction, moveKeys) => {
                        this.setState({
                            targetKeys: nextTargetKeys
                        })
                    }}
                ></Transfer>
            </Modal >
        )
    }
}