import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Vec3 } from 'cc';
import EventManager from './EventManager';
import DataConstant from './DataConstant';
const { ccclass, property } = _decorator;

@ccclass('FollowTouchMove')
export class FollowTouchMove extends Component {

    private _touchCollider: Collider2D = null!;

    onLoad() {
        //拿到2d collider
        this._touchCollider = this.node.getComponent(BoxCollider2D);
        this._touchCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactCallback, this);

        EventManager.Instence.on(DataConstant.EVENT_TOUCH_LINE_MOVE, (data: Vec3) => {
            if (this.node != null) {
                const movePos = data;
                this.node.setPosition(movePos.x, movePos.y);
            }
        }, this);
    }

    onBeginContactCallback(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("begin contact other: " + otherCollider.node.name, ", ", otherCollider.tag);
        //需要监听的注册即可
        EventManager.Instence.emit(DataConstant.EVENT_TOUCH_BEGIN_CONTACT, otherCollider)
    }

    protected onDestroy(): void {
        this._touchCollider.off(Contact2DType.BEGIN_CONTACT);
        EventManager.Instence.off(DataConstant.EVENT_TOUCH_LINE_MOVE, (data: Vec3) => { }, this);
    }

}

