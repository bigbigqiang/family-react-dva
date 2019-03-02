function addZero(num) {
    if (num / 10 < 1) {
        return '0' + num;
    } else {
        return num;
    }
}

function get12Hour(hour) {
    if (hour > 12) {
        return hour - 12+"PM";
    } else {
        return hour+"AM"
    }
}

/**
 * @param {string} fms format string
 * Y Y:18 YY:2018
 * M M:3  MM:03
 * D D:3  DD:03
 * H h:9  hh:21
 * m m:4  mm:04 // 无变化
 * s s:5  ss:05
 */
export function getDate(fms,time) {
    var now;

    if (typeof time === 'string') {
        now = new Date(fms);
    } else {
        now = new Date();
    }
    
    // YY
    if (fms.indexOf('YY') != -1) {
        fms = fms.replace(/YY/g, now.getFullYear()+'');
    }

    // Y
    if (fms.indexOf('Y') != -1) {
        var shortYear = (now.getFullYear() + '').slice(2);
        fms = fms.replace(/Y/g, shortYear+'')
    }

    // MM
    if (fms.indexOf('MM') != -1) {
        fms = fms.replace(/MM/g, addZero(now.getMonth() + 1)+'')
    }

    // M
    if (fms.indexOf('M') != -1) {
        fms = fms.replace(/M/g, now.getMonth() + 1+'')
    }

    // DD
    if (fms.indexOf('DD') != -1) {
        fms = fms.replace(/DD/g, addZero(now.getDate())+'')
    }

    // D
    if (fms.indexOf('D') != -1) {
        fms = fms.replace(/D/g, now.getDate()+'')
    }

    // hh
    if (fms.indexOf('hh') != -1) {
        fms = fms.replace(/hh/g, addZero(now.getHours())+'')
    }

    // h
    if (fms.indexOf('h') != -1) {
        fms = fms.replace(/h/g, get12Hour(now.getHours())+'')
    }

    // mm
    if (fms.indexOf('mm') != -1) {
        fms = fms.replace(/mm/g, addZero(now.getMinutes())+'')
    }

    // m
    if (fms.indexOf('m') != -1) {
        fms = fms.replace(/m/g, now.getMinutes()+'')
    }

    // ss
    if (fms.indexOf('ss') != -1) {
        fms = fms.replace(/ss/g, addZero(now.getSeconds())+'')
    }

    // s
    if (fms.indexOf('s') != -1) {
        fms = fms.replace(/s/g, now.getSeconds()+'')
    }

    return fms;
}