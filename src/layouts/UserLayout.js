import React from 'react';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../../public/favicon.png';
import { getRoutes } from '../utils/utils';
import { checkIfLogin } from "../utils/utils";
import { EllaInfo } from '../common/ellainfo';

// const links = [{
//   title: '帮助',
//   href: '',
// }, {
//   title: '隐私',
//   href: '',
// }, {
//   title: '条款',
//   href: '',
// }];

const copyright = <div>Copyright <Icon type="copyright" /> 2017-{new Date().getFullYear()} {EllaInfo.company}</div>

class UserLayout extends React.PureComponent {
    componentWillMount() {
        checkIfLogin(
            ["#/user/login", "#/user/register", "#/user/register-result"],
            "#/user/login"
        );
    }
    componentWillUpdate() {
        checkIfLogin(
            ["#/user/login", "#/user/register", "#/user/register-result"],
            "#/user/login"
        );
    }
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = EllaInfo.cn_title;
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} - ${EllaInfo.title}`;
        }
        return title;
    }


    render() {
        const { routerData, match } = this.props;
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <div className={styles.container}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <img alt="logo" className={styles.logo} src={logo} />
                            <span className={styles.title}>{EllaInfo.cn_title} {EllaInfo.version}</span>
                        </div>
                    </div>
                    {
                        getRoutes(match.path, routerData).map(item =>
                            (
                                <Route
                                    key={item.key}
                                    path={item.path}
                                    component={item.component}
                                    exact={item.exact}
                                />
                            )
                        )
                    }
                    {/* <GlobalFooter className={styles.footer} links={links} copyright={copyright} /> */}
                    <GlobalFooter className={styles.footer} copyright={copyright} />
                </div>
            </DocumentTitle>
        );
    }
}

export default UserLayout;
