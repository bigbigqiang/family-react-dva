export function origin_upload(file, code, url, callback) {

    const formData = new FormData();
    formData.append('file', file)
    formData.append('fileCode', code)

    // 创建xhr对象
    var xhr = new XMLHttpRequest();
    // 监听状态  实时响应   upload.onprogress：上传进度 load.onprogress: 下载进度
    // xhr.upload.onprogress = function (event) {
    //     if (event.lengthComputable) {  // 当文件大小总大小无法获取时，怎么计算进度呢
    //         var percent = Math.round(event.loaded * 100 / event.total);
    //         console.log('Progress: ' + percent)
    //     }
    //     console.log(event)
    // };
    // 传输开始事件  send后就执行
    xhr.onloadstart = function (event) {
        // console.log('load start');
    }

    // ajax过程传输成功完成事件
    xhr.onload = function (event) {
        // console.log('load success');
        var ret = xhr.responseText; // 服务器返回
        return callback(JSON.parse(ret));
    };

    // ajax 过程发生错误事件
    xhr.onerror = function (event) {
        // console.log('传输错误');
    }
    xhr.onabort = function (event) {
        // console.log('操作被取消');
    }

    // // 不管上传失败或成功，都会触发
    xhr.onloadend = function (event) {
        // console.log('load end');
    }
    xhr.open('POST', url);  // true表示异步
    xhr.send(formData);
}

