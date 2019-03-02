// const localMenuData = {
//     name: "听书首页管理",
//     icon: "customer-service",
//     path: "listen",
//     children: [{
//         name: "首页模块设置",
//         path: "listenindex"
//        },{
//         name: "分类管理",
//         path: "listenclass"
//     },{
//         name: "听单管理",
//         path: "listenlist"
//     },{
//         name: "广告横幅管理",
//         path: "listenad"
//     }
//        ]
// }
import { cacheManager } from '../utils/utils'

function formatter(data, parentPath = "") {
    const list = [];
    data.forEach(item => {
        if (item.children) {
            list.push({
                ...item,
                path: `${parentPath}${item.path}`,
                children: formatter(item.children, `${parentPath}${item.path}/`)
            });
        } else {
            list.push({
                ...item,
                path: `${parentPath}${item.path}`
            });
        }
    });
    return list;
}

export const getMenuData = () => {
    let menuData = cacheManager.get('ellahome_menu') ? JSON.parse(cacheManager.get('ellahome_menu')) : [];
    // if (menuData == []) return [];
    console.log(menuData)
    return menuData ? formatter(menuData) : []
};
