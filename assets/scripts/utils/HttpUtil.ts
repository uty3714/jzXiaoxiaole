
export class HttpUtil {
    /**
     * 延迟多久没回复就返回False
     *
     * @type {number}
     * @memberof DriveManager
     */
    private static TimeOut: number = 5000;

    /**
     * GET请求
     *
     * @static
     * @param {*} url
     * @param {object} [params={}]
     * @param {*} callback
     * @memberof HttpUtil
     */
    public static GET(url, params: object = {}, callback) {
        let dataStr = '';
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(params[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }

        console.log('url:' + url)
        // url = HttpUtil.baseUrl + url;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    // callback(true, JSON.parse(response));
                    callback(true, response);
                } else {
                    callback(false, response);
                }
            }
        };
        xhr.timeout = this.TimeOut;
        xhr.send();
    }

    /**
     * POST请求
     *
     * @static
     * @param {*} url
     * @param {object} [param={}]
     * @param {*} callback
     * @memberof HttpUtil
     */
    public static POST(url, param: object = {}, callback) {
        var xhr = new XMLHttpRequest();
        let dataStr = '';
        Object.keys(param).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
        }
        xhr.open("POST", url, true);
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    // callback(true, JSON.parse(response));
                    callback(true, response);

                } else {
                    callback(false, response);
                }
            }
        };
        console.log('paramData:' + JSON.stringify(param))
        xhr.send(JSON.stringify(param));
    }
}
