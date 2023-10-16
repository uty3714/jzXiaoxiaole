import { _decorator, Component, Node, Graphics, Vec3, UITransform, Vec2, EPhysics2DDrawFlags, instantiate, Prefab, PhysicsSystem2D, BoxCollider2D, Sprite, Quat, PhysicsSystem, PolygonCollider2D, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawLineControll')
export class DrawLineControll extends Component {
    private graphics = null;
    isDrawing = false;
    array = [];

    @property(Prefab) linePrefab: Prefab = null!;

    private _uiTransform: UITransform = null!;

    private _currentPos: Vec3 = Vec3.ZERO;
    private _recordPos: Vec3 = Vec3.ZERO;

    private lineNodeArray: Node[] = [];

    private _collider: PolygonCollider2D = null!;
    protected onLoad(): void {
        PhysicsSystem2D.instance.enable = true; //开启物理引擎
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
        this._uiTransform = this.node.getComponent(UITransform);
    }

    start() {
        console.log("draw line start");
        this.graphics = this.getComponent(Graphics);

        this._collider = this.node.addComponent(PolygonCollider2D);
        this._collider.sensor = true;
        this._collider.on("onBeginContact", this.onCollisionBegin, this);

        this.node.on(Node.EventType.TOUCH_START, this.onMouseDownCallback, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMoveCallback, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUpCallback, this);

        /*
        _recordPos: (104.47, 309.16, 0.00)
DrawLineControll.ts:45 _recordPos: (103.25, -300.55, 0.00)
*/
        // PhysicsSystem.instance.enable = true;
        // const testArray = [new Vec3(104.47, 309.16, 0.00), new Vec3(103.25, -300.55, 0.00)];
        // const physicsSystem = PhysicsSystem.instance;
        // const mask = 0xffffffff; // 碰撞层的掩码，0xffffffff 表示碰撞所有层
        // const maxDistance = 10000000; // 最大碰撞距离
        // const queryTrigger = true; // 是否查询触发器
        // const hit = physicsSystem.lineStripCast(testArray, mask, maxDistance, queryTrigger);

        // console.log("testResult", hit);


    }

    onMouseDownCallback(event) {
        this.isDrawing = true;
        const newV3 = new Vec3(event.getLocation().x, event.getLocation().y, 0);
        const moveToPoint = this._uiTransform.convertToNodeSpaceAR(newV3);
        this.graphics.moveTo(moveToPoint.x, moveToPoint.y);
        //记录第一个点的位置
        this._recordPos = moveToPoint;
        console.log("_recordPos: " + this._recordPos);
    }

    onMouseMoveCallback(event) {
        if (this.isDrawing) {
            const newV3 = new Vec3(event.getLocation().x, event.getLocation().y, 0);
            const lineToPoint = this._uiTransform.convertToNodeSpaceAR(newV3);
            console.log("lineToPoint: " + lineToPoint);

            this.graphics.lineTo(lineToPoint.x, lineToPoint.y);
            this.graphics.stroke();


            this._collider.points = [new Vec2(this._recordPos.x, this._recordPos.y),
            new Vec2(lineToPoint.x, lineToPoint.y)];

            // this.graphics.moveTo(lineToPoint.x, lineToPoint.y);
            // //记录当前手移动到的点
            // this._currentPos = lineToPoint;
            // //计算2点直接的距离
            // const subVec = this._currentPos.subtract(this._recordPos);
            // const distance = subVec.length() + 5;
            // console.log("distance: " + distance);
            // if (distance > 35) {
            //     const tempVec = new Vec2(0, 10);
            //     const angleInRadians = Math.atan2(tempVec.y - subVec.y, tempVec.x - subVec.x);
            //     const rotateVec = angleInRadians * (180 / Math.PI);
            //     console.log("角度（度数）: " + rotateVec);
            //     const lineItem = instantiate(this.linePrefab);
            //     // 创建一个 Quat（四元数）对象，用于表示旋转
            //     const rotationQuat = new Quat();
            //     // 设置节点的旋转角度，例如旋转90度
            //     Quat.fromEuler(rotationQuat, 0, 0, rotateVec);
            //     lineItem.rotation = rotationQuat;
            //     lineItem.setPosition(lineToPoint.x, lineToPoint.y);
            //     lineItem.parent = this.node;
            //     const pbUITransform = lineItem.getComponent(UITransform);
            //     const oldHeight = pbUITransform.contentSize.height;
            //     pbUITransform.setContentSize(distance, oldHeight);
            //     console.log("distance: " + distance);
            //     console.log("lineToPoint: " + lineToPoint);
            //     this._recordPos = new Vec3(lineToPoint.x, lineToPoint.y, 0);;

            //     // const collider = lineItem.getComponent(BoxCollider2D);
            //     // collider.offset.x = - distance / 2;
            //     // collider.size.width = distance;
            //     // collider.apply();


            //     // let tempVec = new Vec2(0, 10);
            //     // // let rotateVec = subVec.angle(tempVec) / Math.PI * 180 - 90;
            //     // const angleInRadians = Math.atan2(tempVec.y - subVec.y, tempVec.x - subVec.x);
            //     // const angleInDegrees = angleInRadians * (180 / Math.PI);
            //     // console.log("角度（度数）: " + angleInDegrees);
            //     // const lineNode = instantiate(this.linePrefab);
            //     // lineNode.setPosition(lineToPoint);
            //     // const pbUITransform = lineNode.getComponent(UITransform);
            //     // const oldHeight = pbUITransform.contentSize.height;
            //     // pbUITransform.setContentSize(distance, oldHeight);
            //     // lineNode.parent = this.node;
            //     // this.lineNodeArray.push(lineNode);
            //     // const rotationQuat = new Quat();
            //     // Quat.fromEuler(rotationQuat, 0, 0, angleInDegrees);
            //     // lineNode.rotation = rotationQuat;
            //     // //this._recordPos = new Vec2(lineToPoint.x, lineToPoint.y);
            // }


            // if (distance >= 25) {
            //     let tempVec = new Vec2(0, 10);
            //     let rotateVec = subVec.angle(tempVec) / Math.PI * 180 - 90;
            //     const lineNode = instantiate(this.linePrefab);
            //     lineNode.setPosition(lineToPoint);
            //     const pbUITransform = lineNode.getComponent(UITransform);
            //     const oldHeight = pbUITransform.contentSize.height;
            //     pbUITransform.setContentSize(25, oldHeight);
            //     lineNode.parent = this.node;
            //     this.lineNodeArray.push(lineNode);
            //     //lineNode.setRotation(rotateVec);
            //     this._recordPos = new Vec2(lineToPoint.x, lineToPoint.y);
            // }
        }
    }

    onCollisionBegin() {
        console.log("onCollisionBegin");
    }

    onMouseUpCallback(event) {
        this.isDrawing = false;
        // this.graphics.clear();
        // this.lineNodeArray.forEach((lineNode) => {
        //     lineNode.destroy();
        // })
    }



}

