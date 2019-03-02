function getError(option, xhr) {
    const msg = `cannot post ${option.action} ${xhr.status}'`;
    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'POST';
    err.url = option.action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}
// XMLHTTPREQUEST 方法，如果request和fetch不好用，可以尝试
// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
// }
/**
 * 配合 Upload 的 customRequest 使用，option为 customRequest 的传参 ， 具体可参见官方文档
 */
export default function cr_upload(option) {
    const xhr = new XMLHttpRequest();

    if (option.onProgress && xhr.upload) {
        xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
            // console.log(e.total)
        };
    }

    const formData = new FormData();

    if (option.data) {
        Object.keys(option.data).map(key => {
            formData.append(key, option.data[key]);
        });
    }

    formData.append(option.filename, option.file);

    xhr.onerror = function error(e) {
        option.onError(e);
    };

    xhr.onload = function onload() {
        // allow success when 2xx status
        // see https://github.com/react-component/upload/issues/34
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(option, xhr), getBody(xhr));
        }

        option.onSuccess(getBody(xhr), xhr);
    };


    xhr.open('POST', option.action, true);

    // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    const headers = option.headers || {};

    // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33
    if (headers['X-Requested-With'] !== null) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    xhr.setRequestHeader("Cache-Control", "no-cache");

    for (const h in headers) {
        if (headers.hasOwnProperty(h) && headers[h] !== null) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }
    // console.log(xhr)
    xhr.send(formData);

    return {
        abort() {
            xhr.abort();
        },
    };
}