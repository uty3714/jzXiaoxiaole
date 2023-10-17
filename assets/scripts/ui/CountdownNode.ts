import { _decorator, Component, Label, Node } from 'cc';
import { util } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('CountdownNode')
export class CountdownNode extends Label {

    private countdownTime: number;

    private _timerTask: () => void;


    private updateCountdown() {

        if (this._timerTask != null) {
            this.unschedule(this._timerTask);
        }
        this._timerTask = function () {
            if (this.countdownTime > 0) {
                this.countdownTime--;
                this.string = util.secToTime(this.countdownTime);
            } else {
                this.unschedule(this._timerTask);
                console.log("倒计时结束");
            }
        }
        this.schedule(this._timerTask, 1);
    }


    restart() {
        this.countdownTime = 180; // 设置初始倒计时时间（单位：秒）  
        this.updateCountdown();
    }

    addTime(value: number) {
        this.countdownTime += value;
        this.updateCountdown();
    }


}

