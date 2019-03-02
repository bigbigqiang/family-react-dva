import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
    app,
    // eslint-disable-next-line no-underscore-dangle
    models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
        const p = component();
        return new Promise((resolve, reject) => {
            p.then((Comp) => {
                resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
            }).catch(err => reject(err));
        });
    },
});

function getFlatMenuData(menus) {
    let keys = {};
    menus.forEach((item) => {
        if (item.children) {
            keys[item.path] = item.name;
            keys = { ...keys, ...getFlatMenuData(item.children) };
        } else {
            keys[item.path] = item.name;
        }
    });
    return keys;
}

export const getRouterData = (app) => {
    const routerData = {
        '/': {
            component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
        },
        '/test': {
            component: dynamicWrapper(app, ['test'], () => import('../routes/Test/Test')),
        },
        '/account/search': {
            component: dynamicWrapper(app, ['account'], () => import('../routes/Account/Search')),
        },
        '/account/search_code': {
            component: dynamicWrapper(app, ['code'], () => import('../routes/Account/CodeSearch')),
        },
        '/account/partner': {
            component: dynamicWrapper(app, ['account'], () => import('../routes/Account/Partner')),
        },
        '/account/garden_info': {
            component: dynamicWrapper(app, ['garden'], () => import('../routes/Account/GardenInfo')),
        },
        '/account/garden': {
            component: dynamicWrapper(app, ['garden', 'authority'], () => import('../routes/Account/GardenList')),
        },
        '/account/self_regist_garden': {
            component: dynamicWrapper(app, ['garden', 'authority'], () => import('../routes/Account/SelfRegistGardenList')),
        },
        '/account/garden_detail': {
            component: dynamicWrapper(app, ['garden', 'authority'], () => import('../routes/Account/GardenDetail')),
        },
        '/account/garden_verify': {
            component: dynamicWrapper(app, ['garden', 'authority'], () => import('../routes/Account/GardenVerify')),
        },
        '/account/class': {
            component: dynamicWrapper(app, ['class', 'garden'], () => import('../routes/Account/ClassList')),
        },
        '/account/teacher': {
            component: dynamicWrapper(app, ['teacher', 'garden'], () => import('../routes/Account/TeacherList')),
        },
        '/account/authority': {
            component: dynamicWrapper(app, ['authority'], () => import('../routes/Account/Authority')),
        },
        '/internal_accounts/regionalManager': {
            component: dynamicWrapper(app, ['regionalManager'], () => import('../routes/internalAccounts/RegionalManager')),
        },
        '/internal_accounts/cityManager': {
            component: dynamicWrapper(app, ['cityManager'], () => import('../routes/internalAccounts/CityManager')),
        },
        '/internal_accounts/operator': {
            component: dynamicWrapper(app, ['authority','operator'], () => import('../routes/internalAccounts/Operator')),
        },
        '/course/defaultlesson': {
            component: dynamicWrapper(app, ['lesson'], () => import('../routes/Course/DefaultLesson')),
        },
        '/course/customerlesson': {
            component: dynamicWrapper(app, ['lesson'], () => import('../routes/Course/CustomerLesson')),
        },
        '/content/banner': {
            component: dynamicWrapper(app, ['banner'], () => import('../routes/Content/Banner')),
        },
        '/content/subjects': {
            component: dynamicWrapper(app, ['subjects'], () => import('../routes/Content/Subjects')),
        },
        '/content/subjects_edit': {
            component: dynamicWrapper(app, ['subjects'], () => import('../routes/Content/SubjectEdit')),
        },
        '/content/customcolumn': {
            component: dynamicWrapper(app, ['customcolumn'], () => import('../routes/Content/CustomColumn')),
        },
        '/content/custom_edit': {
            component: dynamicWrapper(app, ['customedit'], () => import('../routes/Content/CustomEdit')),
        },
        '/content/adbanneryin': {
            component: dynamicWrapper(app, ['adbanner'], () => import('../routes/Content/AdBanneryin'))
        },
        '/content/appindex': {
            component: dynamicWrapper(app, ['appindex'], () => import('../routes/Content/AppIndex')),
        },
        '/content/appclass': {
            component: dynamicWrapper(app, ['appclass'], () => import('../routes/Content/AppClass')),
        },
        '/vipcode/list': {
            component: dynamicWrapper(app, ['vipcode'], () => import('../routes/VIPCode/CodeList')),
        },
        '/vipcode/detail': {
            component: dynamicWrapper(app, ['vipcode'], () => import('../routes/VIPCode/CodeDetail')),
        },
        '/vipcode/used': {
            component: dynamicWrapper(app, ['vipcode'], () => import('../routes/VIPCode/UsedCodeList')),
        },
        '/vipcode/present_list': {
            component: dynamicWrapper(app, ['vipsend'], () => import('../routes/VIPCode/PresentList')),
        },
        '/vipcode/present_list_detail': {
            component: dynamicWrapper(app, ['vipsend'], () => import('../routes/VIPCode/PresentDetail')),
        },
        '/divide/company': {
            component: dynamicWrapper(app, ['divide'], () => import('../routes/OnlineDivide/Company')),
        },
        '/divide/garden': {
            component: dynamicWrapper(app, ['divide'], () => import('../routes/OnlineDivide/Garden')),
        },
        '/divide/garden_detail': {
            component: dynamicWrapper(app, ['divide'], () => import('../routes/OnlineDivide/GardenDetail')),
        },
        '/divide/partner': {
            component: dynamicWrapper(app, ['divide'], () => import('../routes/OnlineDivide/Partner')),
        },
        '/divide/partner_detail': {
            component: dynamicWrapper(app, ['divide'], () => import('../routes/OnlineDivide/PartnerDetail')),
        },
        '/approval/partner_divide': {
            component: dynamicWrapper(app, ['approval'], () => import('../routes/Approval/Partner')),
        },
        '/approval/partner_divide_detail': {
            component: dynamicWrapper(app, ['approval'], () => import('../routes/Approval/PartnerDetail')),
        },
        '/approval/garden_divide': {
            component: dynamicWrapper(app, ['approval'], () => import('../routes/Approval/Garden')),
        },
        '/approval/garden_divide_detail': {
            component: dynamicWrapper(app, ['approval'], () => import('../routes/Approval/GardenDetail')),
        },
        '/order/orderlist': {
            component: dynamicWrapper(app, ['order'], () => import('../routes/Order/OrderList')),
        },
        '/user': {
            component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        },
        '/user/login': {
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
        },
        '/version/version': {
            component: dynamicWrapper(app, ['version'], () => import('../routes/Version/Version')),
        },
        '/data/customer_data': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/CustomerData')),
        },
        '/data/use_data': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/UseData')),
        },
        '/data/garten_detail': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/gartenDetail'))
        },
        /*20180822 lyf start */
        '/data/partner': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/PartnerList'))
        },
        '/data/kinder_garten': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/KinderGartenList'))
        },
        /*20180822 lyf end */
        '/data/course': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/CourseData'))
        },
        '/exception/403': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        },
        '/exception/404': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        },
        '/exception/500': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        },
        '/exception/trigger': {
            component: dynamicWrapper(app, ['error'], () =>
                import('../routes/Exception/triggerException')
            ),
        },
        '/data/course': {
            component: dynamicWrapper(app, ['data'], () => import('../routes/Data/CourseData'))
        },
        '/listen/listenindex': {
            component: dynamicWrapper(app, ['listenindex'], () => import('../routes/Listen/ListenIndex')),
        },
        '/listen/listenclass': {
            component: dynamicWrapper(app, ['listenclass'], () => import('../routes/Listen/ListenClass')),
        },
        '/listen/listenlist': {
            component: dynamicWrapper(app, ['listenlist'], () => import('../routes/Listen/ListenList')),
        },
        '/listen/listenad': {
            component: dynamicWrapper(app, ['listenad'], () => import('../routes/Listen/ListenAD')),
        },
        '/listen/listen_edit': {
            component: dynamicWrapper(app, ['listenedit'], () => import('../routes/Listen/ListenEdit')),
        },
        '/friendCircle/sensitivewords': {
            component: dynamicWrapper(app, ['sensitivewords'], () => import('../routes/FriendCircle/SensitiveWords')),
        },
        '/friendCircle/information': {
            component: dynamicWrapper(app, ['sensitiveinfo'], () => import('../routes/FriendCircle/Information')),
        },
        '/friendCircle/informationdetail': {
            component: dynamicWrapper(app, ['sensitiveinfo'], () => import('../routes/FriendCircle/InformationDetail')),
        },
        '/friendCircle/informationreply': {
            component: dynamicWrapper(app, ['sensitiveinfo'], () => import('../routes/FriendCircle/InformationReply')),
        },
        '/friendCircle/ellaeditor': {
            component: dynamicWrapper(app, ['friendCircle'], () => import('../routes/FriendCircle/EllaEditor')),
        },
    };
    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());
    const routerDataWithName = {};
    Object.keys(routerData).forEach((item) => {
        routerDataWithName[item] = {
            ...routerData[item],
            name: routerData[item].name || menuData[item.replace(/^\//, '')],
        };
    });
    return routerDataWithName;
};
