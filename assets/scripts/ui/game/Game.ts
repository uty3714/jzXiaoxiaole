import { _decorator, Camera, Canvas, Component, EventTouch, Graphics, Input, input, instantiate, Node, Prefab, resources, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Canvas) mainCanvas: Canvas = null!;
    @property(Prefab) pbPzBJzPrefab: Prefab = null!;
    @property(Prefab) pbPzBCmPrefab: Prefab = null!;

    @property(Node) testNode1: Node = null!;
    @property(Node) testNode2: Node = null!;


    protected onLoad(): void {

        //实例化 草莓预制体 
        const pzBCmNode = instantiate(this.pbPzBCmPrefab);
        //实例化 橘子预制体
        const pzBJzNode = instantiate(this.pbPzBJzPrefab);

        //添加到场景
        this.testNode1.addChild(pzBCmNode);
        this.testNode2.addChild(pzBJzNode);

    }

}

