import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, cacheManager } from '../utils/utils';
import { getMenuData } from '../common/menu';
import { EllaInfo } from '../common/ellainfo.js';

import { checkIfLogin } from "../utils/utils";

import styles from "./BasicLayout.less";
import lodash from 'lodash'

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirectData.push({
                from: `/${item.path}`,
                to: `/${item.children[0].path}`,
            });
            item.children.forEach((children) => {
                getRedirect(children);
            });
        }
    }
};
getMenuData().forEach(getRedirect);

const { Content } = Layout;
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

let isMobile;
enquireScreen((b) => {
    isMobile = b;
});

class BasicLayout extends React.PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    }

    state = {
        isMobile,
    };

    componentWillMount() {
        checkIfLogin(["#/user/login", "#/user/register", "#/user/register-result"], "#/user/login");
        // 如果没有登录，也不在以上3个路由中，则跳转到 #/user/login
    }
    componentWillUpdate() {
        checkIfLogin(["#/user/login", "#/user/register", "#/user/register-result"], "#/user/login");
        // 如果没有登录，也不在以上3个路由中，则跳转到 #/user/login
    }

    getChildContext() {
        const { location, routerData } = this.props;
        return {
            location,
            breadcrumbNameMap: routerData,
        };
    }
    componentDidMount() {
        enquireScreen((b) => {
            this.setState({
                isMobile: !!b,
            });
        });
    }
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = EllaInfo.cn_title;
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} | ${EllaInfo.cn_title}`;
        }
        return title;
    }

    render() {
        const {
            currentUser, collapsed, fetchingNotices, notices, routerData, match, location, dispatch,
        } = this.props;

        const isGarden = cacheManager.get('ellahome_CGC')

        // layout会在每次切换页面的时候render，每次render都去重新获取菜单
        const indexPath = isGarden ? '/account/garden_info' : '/account/search'

        const layout = (
            <Layout className={styles.limitWidth}>
                <SiderMenu
                    collapsed={collapsed}
                    location={location}
                    dispatch={dispatch}
                    isMobile={this.state.isMobile}
                />
                <Layout className={styles.mainContent}>
                    <GlobalHeader
                        currentUser={currentUser}
                        fetchingNotices={fetchingNotices}
                        notices={notices}
                        collapsed={collapsed}
                        dispatch={dispatch}
                        isMobile={this.state.isMobile}
                    />
                    <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                        <div style={{ minHeight: 'calc(100vh - 260px)' }}>
                            <Switch>
                                {
                                    redirectData.map(item =>
                                        <Redirect key={item.from} exact from={item.from} to={item.to} />
                                    )
                                }
                                {
                                    getRoutes(match.path, routerData).map(item => (
                                        <Route
                                            key={item.key}
                                            path={item.path}
                                            component={item.component}
                                            exact={item.exact}
                                        />
                                    ))
                                }
                                <Redirect exact from="/" to={indexPath} />
                                <Route render={NotFound} />
                            </Switch>
                        </div>
                        <GlobalFooter
                            copyright={
                                <div>Copyright <Icon type="copyright" /> 2017-{new Date().getFullYear()} {EllaInfo.company}</div>
                            }
                        />
                    </Content>
                </Layout>
            </Layout>
        );

        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query} >
                    {params => <div className={classNames(params)}>{layout}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

export default connect(state => ({
    currentUser: state.user.currentUser,
    collapsed: state.global.collapsed,
    fetchingNotices: state.global.fetchingNotices,
    notices: state.global.notices,
    login: state.login
}))(BasicLayout);
