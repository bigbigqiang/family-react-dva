/**
 * 园所登录的首页
 */
import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import styles from './GardenInfo.less';
import { getParameter, cacheManager } from '../../utils/utils';

@connect(state => ({
    garden: state.garden
}))
export default class GardenInfo extends PureComponent {

    componentDidMount() {
        let CGC = cacheManager.get('ellahome_CGC');
        if (CGC) {
            let uid = cacheManager.get('uid');
            this.props.dispatch({
                type: 'garden/getTheGarden',
                payload: {
                    uid
                }
            })
        }
    }

    render() {

        const {
            garden: {
                theGarden
            }
        } = this.props;

        const businessCode = getParameter('businessCode');  // 运营人员从其它页面跳转过来的情况
        const CGC = cacheManager.get('ellahome_CGC');

        let gardenCode = CGC || businessCode;

        return (
            <div className={styles.infoBox}>
                <h2 className={styles.title}>园所基本信息</h2>
                {gardenCode ? <div>
                    <p>
                        <span className={styles.key}>园所名称：</span>
                        <span>{_.get(theGarden, 'data.kindergartenName', '')}</span>
                    </p>
                    <p>
                        <span className={styles.key}>园所联系人：</span>
                        <span>{_.get(theGarden, 'data.contacter', '')}</span>
                    </p>
                    <p>
                        <span className={styles.key}>联系人手机号：</span>
                        <span>{_.get(theGarden, 'data.phone', '')}</span>
                    </p>
                    <p>
                        <span className={styles.key}>园所地址：</span>
                        <span>{_.get(theGarden, 'data.kindergartenAddress', '')}</span>
                    </p>
                    <p>
                        <span className={styles.key}>所属合伙人：</span>
                        <span>{_.get(theGarden, 'data.partnerName', '')}</span>
                    </p>
                </div> : <div style={{ textAlign: 'center' }}>该页面仅供园所使用</div>}
            </div>
        )
    }
}
