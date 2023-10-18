import { _decorator, Component, Graphics, Node, Input, UITransform, Vec3, EventTouch, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import EventManager from './EventManager';
import DataConstant from './DataConstant';

@ccclass('DrawLine')
export class DrawLine extends Component {

    @property(Node) pNode: Node = null!;
    @property(Node) followTouchNode: Node = null!;
    private _grpDrawLine: Graphics = null;
    private _isDrawing = false;
    private _uiParentTransform: UITransform = null!;
    private _recordPos: Vec3 = Vec3.ZERO;

    private _callback: Function = null!;

    onLoad() {
        this.followTouchNode.active = false;
        this._grpDrawLine = this.getComponent(Graphics);
        this._uiParentTransform = this.pNode.getComponent(UITransform);
        // 监听触摸事件
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEndCallback, this);

        this._callback = () => {
            console.log("停止绘制:");
            this.stopDrawing();
        }

        EventManager.Instence.on(DataConstant.EVENT_BEGIN_CONTACT_FAIL, this._callback, this)
    }




    onTouchStartCallback(event: EventTouch) {
        this._isDrawing = true;
        const newV3 = new Vec3(event.getLocation().x, event.getLocation().y, 0);
        const moveToPoint = this._uiParentTransform.convertToNodeSpaceAR(newV3);
        //发送消息
        EventManager.Instence.emit(DataConstant.EVENT_TOUCH_LINE_START);

        this.followTouchNode.setPosition(moveToPoint.x, moveToPoint.y);
        this.followTouchNode.active = true;

        this._grpDrawLine.moveTo(moveToPoint.x, moveToPoint.y);
        //记录第一个点的位置
        this._recordPos = moveToPoint;
        console.log("_recordPos: " + this._recordPos);
    }

    onTouchMoveCallback(event: EventTouch) {
        if (this._isDrawing) {
            const newV3 = new Vec3(event.getLocation().x, event.getLocation().y, 0);
            const lineToPoint = this._uiParentTransform.convertToNodeSpaceAR(newV3);
            const sendPos = lineToPoint.clone();
            //发送消息，让检测点跟着碰撞
            EventManager.Instence.emit(DataConstant.EVENT_TOUCH_LINE_MOVE, sendPos);
            this._grpDrawLine.lineTo(lineToPoint.x, lineToPoint.y);
            this._grpDrawLine.stroke();
        }
    }

    onTouchEndCallback(event: EventTouch) {
        this.stopDrawing();
        EventManager.Instence.emit(DataConstant.EVENT_TOUCH_LINE_END);
    }

    private stopDrawing() {
        this._isDrawing = false;
        if (this._grpDrawLine != null) {
            this._grpDrawLine.clear();
        }
        if (this.followTouchNode != null) {
            this.followTouchNode.active = false;
        }
    }

    protected onDestroy(): void {
        EventManager.Instence.off(DataConstant.EVENT_BEGIN_CONTACT_FAIL, this._callback, this);
        // 监听触摸事件
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEndCallback, this);
    }

}

