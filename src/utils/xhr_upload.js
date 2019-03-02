export function xhr_upload(url, object) {
    console.log(object)
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        for (var key in object) {
            console.log(object[key])
            formData.append(key, object[key])
        }

        // 创建xhr对象
        var xhr = new XMLHttpRequest();
        // 监听状态  实时响应   upload.onprogress：上传进度 load.onprogress: 下载进度
        // xhr.upload.onprogress = function (event) {
        //     // if (event.lengthComputable) {  // 当文件大小总大小无法获取时，怎么计算进度呢
        //     //     var percent = Math.round(event.loaded * 100 / event.total);
        //     //     console.log('Progress: ' + percent)

        //     // }
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
            resolve(JSON.parse(ret));
        };

        // ajax 过程发生错误事件
        xhr.onerror = function (event) {
            // console.log('传输错误');
            reject(event)
        }
        xhr.onabort = function (event) {
            // console.log('操作被取消');
            reject(event)
        }

        // // 不管上传失败或成功，都会触发
        xhr.onloadend = function (event) {
            // console.log('load end');
        }
        console.log(formData)
        xhr.open('POST', url);  // true表示异步
        xhr.send(formData);
    })

}