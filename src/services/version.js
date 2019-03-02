
import { stringify } from 'qs';
import request from '../utils/request';
import { server } from '../utils/utils';
import { xhr_upload } from '../utils/xhr_upload';
import { message } from 'antd';
import lodash from 'lodash';


/**
 * @description 版本提交
 */
export async function versionCommit(payload) {
    // console.log(payload)
    return xhr_upload(server.versionUrl, {
        versionResource: payload.versionResource,
        versionNum: payload.versionNum,
        description: payload.description,       //版本描述
        file: payload.file,                     //安装包
        enforceUpdate: payload.enforceUpdate    //default/custom 默认课表/自定义课表
    }).then(res => {
        if (res.status == '1') {
            message.success('提交成功!')
        } else {
            message.error('提交版本信息失败!')
        }
    }).catch(err => console.error(err))
}

