import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("util")
export class util {

    public static secToTime(s: number, isCn?: any, _obj?: any) {
        var obj = _obj || {};
        var t;
        s = Math.ceil(s);
        if (s > -1) {
            var hour: number = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            var day = hour / 24;

            if (day > 0 && !obj.noDay) {
                hour = hour - 24 * day;
                t = day + "天 " + (obj.fold == 'day' ? '\n' : '');
                if (isCn) {
                    if (hour > 0) t += hour + '小时';
                } else {
                    t += hour + ':';
                }
            } else {
                if (hour > 0 && hour < 10) {
                    t = "0" + hour + (isCn ? '小时' : ":");
                } else if (hour > 9) {
                    t = hour + (isCn ? '小时' : ":");
                } else {
                    t = "";
                }
            }

            if (obj.noHour) {
                t = '';
                min += hour * 60;
            }

            if (isCn) {
                if (min > 0) t += min + (obj.strMin || '分');
                if (!obj.noSec && sec > 0) t += sec + '秒';
            } else {

                var minstr, secstr;
                if (min < 10) {
                    minstr = "0" + min;
                } else {
                    minstr = '' + min;
                }
                if (!obj.noSec && sec < 10) {
                    secstr = "0" + sec;
                } else {
                    secstr = '' + sec;
                }

                t += minstr + ':';
                t += secstr;
            }
            return t;
        } else {
            return '';
        }
    }
}