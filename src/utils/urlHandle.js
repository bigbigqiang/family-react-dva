/**
 * 
 * @param {*} name 
 */
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

/**
 * 
 * @param {*} str 
 */
export function getParameterName(str) {
    var start = str.indexOf("=");
    if (start == -1) {
        return str;
    }
    return str.substring(0, start);
}

/**
 * 
 * @param {*} str 
 */
export function getParameterValue(str) {
    var start = str.indexOf("=");
    if (start == -1) {
        return "";
    }
    return str.substring(start + 1);
}

export const urlHandle = {
    getParameter: getParameter
}