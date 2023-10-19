import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NetUtil')
export class NetUtil {
    public static getHttp() {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', "https://www.baidu.com", false);
        httpRequest.setRequestHeader("", "Access-Control-Allow-Origin");
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
            console.log("http: callback", httpRequest.responseText);

        }
    }

}

