import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("util")
export class util {

    public static createHealthJson(health: number): string {
        return "{\"day\":" + Date.now() + ",\"health\": " + health + "}";
    }

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


    /**
     * 判断是否是新的一天
     * @param {Object|Number} dateValue 时间对象 todo MessageCenter 与 pve 相关的时间存储建议改为 Date 类型
     * @returns {boolean}
     */
    public static isNewDay(dateValue: any) {

        var oldDate = new Date(dateValue);
        var curDate = new Date();

        var oldYear = oldDate.getFullYear();
        var oldMonth = oldDate.getMonth();
        var oldDay = oldDate.getDate();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth();
        var curDay = curDate.getDate();

        if (curYear > oldYear) {
            return true;
        } else {
            if (curMonth > oldMonth) {
                return true;
            } else {
                if (curDay > oldDay) {
                    return true;
                }
            }
        }

        return false;
    }
}