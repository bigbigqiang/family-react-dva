import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, message, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
// import NoticeIcon from '../../components/NoticeIcon';
// import HeaderSearch from '../../components/HeaderSearch';
import logo from '../../../public/favicon.png';
import styles from './index.less';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
    componentDidMount() {
        this.props.dispatch({
            type: 'user/fetchCurrent',
        });
    }
    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }
    getNoticeData() {
        const { notices = [] } = this.props;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map((notice) => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            // transform id to item key
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = ({
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                })[newNotice.status];
                newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }
    handleNoticeClear = (type) => {
        message.success(`清空了${type}`);
        this.props.dispatch({
            // type: 'global/clearNotices',
            payload: type,
        });
    }
    handleNoticeVisibleChange = (visible) => {
        if (visible) {
            this.props.dispatch({
                // type: 'global/fetchNotices',
            });
        }
    }
    handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            this.props.dispatch({
                type: 'login/logout',
            });
        }
        // if (key === 'reset') {
        //     this.props.dispatch({
        //         type: 'login/reset',
        //     })
        // }
    }
    toggle = () => {
        const { collapsed } = this.props;
        this.props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: !collapsed,
        });
        this.triggerResizeEvent();
    }
    @Debounce(600)
    triggerResizeEvent() { // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }
    render() {
        const {
            currentUser, collapsed, fetchingNotices, isMobile,
        } = this.props;
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
                {/* <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item> */}
                {/* <Menu.Item key="reset">
                    <Link to="/user/reset">
                        <Icon type="setting" />
                        重置密码
                    </Link>
                </Menu.Item>
                <Menu.Divider /> */}
                <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </Menu>
        );
        const noticeData = this.getNoticeData();
        return (
            <Header className={styles.header}>
                {isMobile && (
                    [(
                        <Link to="/" className={styles.logo} key="logo">
                            <img src={logo} alt="logo" width="32" />
                        </Link>),
                    <Divider type="vertical" key="line" />,
                    ]
                )}
                <Icon
                    className={styles.trigger}
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div className={styles.right}>
                    {currentUser.name ? (
                        <Dropdown overlay={menu}>
                            <span className={`${styles.action} ${styles.account}`}>
                                {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} /> */}
                                <span className={styles.name}>{currentUser.name}</span>
                            </span>
                        </Dropdown>
                    ) : <Spin size="small" style={{ marginLeft: 8 }} />}
                </div>
            </Header>
        );
    }
}
