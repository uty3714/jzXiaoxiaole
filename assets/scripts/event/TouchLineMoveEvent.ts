import { _decorator, Vec3, Event } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchLineMoveEvent')
export default class TouchLineMoveEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: Vec3) {
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: Vec3 = null;  // 自定义的属性
}

