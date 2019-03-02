import moment from 'moment';
import Base64 from './Base64';

export function captureVideoImage({ link, fileType, fileName, quality }) {
    return new Promise((resolve, reject) => {
        try {
            let video = document.createElement('video');
            video.onloadeddata = function (obj) {
                let
                    canvas = document.createElement("canvas"),
                    ctx = canvas.getContext('2d');

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                let base64 = canvas.toDataURL(fileType || 'image/jpeg', quality || 1.0);

                let
                    arr = base64.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                resolve(new File([u8arr], fileName || 'default', { type: mime }));
            }
            video.onerror = function (err) {
                reject(err)
            }
            video.crossOrigin = 'Anonymous'
            video.src = link;
        } catch (err) {
            reject(err)
        }

    })
};

export function encode(obj) {
    return Base64.encode(window.encodeURI(JSON.stringify(obj))) // 部分浏览器不支持atob方法
}

export function decode(string) {
    if (string) {
        return JSON.parse(window.decodeURI(Base64.decode(string))) // 部分浏览器不支持atob方法
    } else {
        return null
    }
}

export const cacheManager = {
    storageToken: '3f9c54bc796ac0bfa1cd7c8868d68cfb',
    get: function (key) {
        try {
            let result = localStorage.getItem(cacheManager.storageToken);
            result = decode(result);
            if (key) {
                return result[key]
            } else {
                return result
            }
        } catch (err) {
            return false;
        }
    },
    set: function (key, value) {
        let originCache = cacheManager.get() || {};
        originCache[key] = value;
        localStorage.setItem(cacheManager.storageToken, encode(originCache))
    },
    clear: function () {
        localStorage.removeItem(cacheManager.storageToken)
    }
}

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - (day * oneDay);

        return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
    }

    if (type === 'year') {
        const year = now.getFullYear();

        return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
    }
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach((node) => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟'],
    ];
    let num = Math.abs(n);
    let s = '';
    fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = '';
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
            p = digit[num % 10] + unit[1][j] + p;
            num = Math.floor(num / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }

    return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!');  // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    } else if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

/**
 *
 * @param {*} path
 * @param {*} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(routePath =>
        routePath.indexOf(path) === 0 && routePath !== path);
    routes = routes.map(item => item.replace(path, ''));
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        let isAdd = false;
        isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    const renderRoutes = renderArr.map((item) => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            key: `${path}${item}`,
            path: `${path}${item}`,
            component: routerData[`${path}${item}`].component,
            exact,
        };
    });
    return renderRoutes;
}

/**
 *
 * @param {array} n 不登录也可以访问的路由
 * @param {string} l 如果检测到未登录，又不在免登陆访问列表 n 中，则跳转到 l
 * 除了传入的路径，其它路径必须登录了才能访问
 */
export function checkIfLogin(n, l) {
    if (cacheManager.get("uid")) {
        return true;
    } else {
        // window.location.hash = window.location.hash!=="#/user/login"?"#/user/login":window.location.hash;
        for (let index = 0; index < n.length; index++) {
            if (window.location.hash === n[index]) {
                return false; // 如果存在于免登录访问列表中，则直接返回false，未登录，但是不跳转页面
            }
        }
        window.location.hash = l;
    }
}

export function getParameter(name) {

    var url = document.location.href;
    var start = url.indexOf("?") + 1;
    if (start == 0) {
        return "";
    }
    var value = "";
    var queryString = url.substring(start);
    var paraNames = queryString.split("&");
    if (name) {
        for (var i = 0; i < paraNames.length; i++) {
            if (name == getParameterName(paraNames[i])) {
                value = getParameterValue(paraNames[i])
            }
        }
        return value;
    } else {
        var all = {};
        for (var i = 0; i < paraNames.length; i++) {
            if (paraNames[i].indexOf('=') != -1 && paraNames[i].indexOf('=') != 0) {
                var value = getParameterValue(paraNames[i]);
                var name = getParameterName(paraNames[i]);
                all[name] = value;
            }
        }
        return all;
    }
}

export function getParameterName(str) {
    var start = str.indexOf("=");
    if (start == -1) {
        return str;
    }
    return str.substring(0, start);
}

export function getParameterValue(str) {
    var start = str.indexOf("=");
    if (start == -1) {
        return "";
    }
    return str.substring(start + 1);
}

export function getBase64(img, callback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', () => reject(reader.result));
        reader.readAsDataURL(img);
    })
}

export function Base64toBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// 前OMS 2.0 base64 转 Blob 方法
export function convertBase64UrlToBlob(urlData) {
    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    // console.log('type:' + urlData.split(',')[0].split(':')[1].split(';')[0]);
    var type = urlData.split(',')[0].split(':')[1].split(';')[0];
    return new Blob([ab], { type: type });
}

// 当给服务器发送数据的时候，请使用该方法对数据进行编码
export function encodeFormData(data) {
    if (!data) return '';
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name.replace('%20', '+'));
        value = encodeURIComponent(value.replace('%20', '+'));
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

let serverPath = window.ellaHomeApi || '118.31.171.207:9000';
let serverBookPath = window.ellaBookApi || '118.31.171.207:9000';

export const server = {
    serverPath: serverPath,
    url: `${serverPath}/rest/api/service?device=pc&pcuid=${cacheManager.get('uid')}`,
    bookurl: `${serverBookPath}/rest/api/service?device=pc&pcuid=${cacheManager.get('uid')}`,
    excelUploadUrl: `${serverPath}/rest/importExcel/importClass`,
    imgUploadUrl: `${serverPath}/rest/upload/avatarHome`,
    htmlUploadUrl: `${serverPath}/rest/upload/document`,
    versionUrl: `${serverPath}/rest/version/update`,
    excelOutput: `${serverPath}/rest/importExcel/orderToExcel`,
}
