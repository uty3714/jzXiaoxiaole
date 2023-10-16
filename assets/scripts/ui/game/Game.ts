import { _decorator, BoxCollider2D, CCFloat, Collider2D, Component, director, error, instantiate, log, Node, Prefab, resources } from 'cc';
import { PzEnumType } from '../../utils/PzEnumType';
import { MathUtil } from '../../utils/MathUtil';
import DataConstant from '../../utils/DataConstant';
import EventManager from '../../utils/EventManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    private static readonly bandPzAddParentNode: string = "ParentNode";

    @property(Node) gameBanNode: Node = null!;
    @property(Node) touchNode: Node = null!;
    @property(CCFloat) gameLevel: number = 1;

    private _banMiddleNode: Node = null;
    private _banRightNode: Node = null;
    private _banLeftNode: Node = null;

    //瓶子所有的类型
    private readonly pzArray = [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206, 301, 302, 303, 304];

    //碰撞的对象
    private firstColliderObject: number = -1;
    private colliderObject: number[] = [];

    protected onLoad(): void {
        console.log("this.gameBanNode", this.gameBanNode);

        this._banMiddleNode = this.gameBanNode.getChildByName('pbBanMiddleNode');
        this._banLeftNode = this.gameBanNode.getChildByName('pbBanLeftNode');
        this._banRightNode = this.gameBanNode.getChildByName('pbBanRightNode');
        this.initPz();

        //
        this.registerColliderCallback();

    }

    private registerColliderCallback() {
        EventManager.Instence.on(DataConstant.EVENT_TOUCH_BEGIN_CONTACT,
            (otherCollider: Collider2D) => {
                console.log("game检测到碰撞: ", otherCollider.node.name, otherCollider.tag);
                if (-1 == this.firstColliderObject) {
                    //记录
                    this.firstColliderObject = otherCollider.tag;
                    //添加记录
                    if (this.colliderObject != null) {
                        this.colliderObject.push(otherCollider.tag);
                    }

                } else {
                    if (this.firstColliderObject == otherCollider.tag) {
                        if (this.colliderObject != null) {
                            this.colliderObject.push(otherCollider.tag);
                        }
                    } else {
                        this.resetData();
                        EventManager.Instence.emit(DataConstant.EVENT_BEGIN_CONTACT_FAIL);
                    }
                }
            }, this);
    }

    private resetData() {
        this.firstColliderObject = -1;
        if (this.colliderObject == null) {
            this.colliderObject = [];
        } else {

        }

    }

    private initPz() {
        this.resetData();
        if (1 == this.gameLevel) {
            //生成3个
            this.createMiddlePzData(this._banMiddleNode);
            this.createMiddlePzData(this._banLeftNode);
            this.createMiddlePzData(this._banRightNode);
        }
    }

    /**
     * 创建中间板子上的瓶子数据
     */
    private createMiddlePzData(banNode: Node) {
        const banCreateMaxPzNum = MathUtil.randomBanPzNum(3);
        console.log("当前的板子", banNode.name, "应该生成", banCreateMaxPzNum, "个瓶子");
        const bandAddPzParentNode = banNode.getChildByName(Game.bandPzAddParentNode);
        if (3 == banCreateMaxPzNum) {
            //生成3个预制体
            this.createBanMiddlePz(bandAddPzParentNode);
            this.createBanLeftPz(bandAddPzParentNode);
            this.createBanRightPz(bandAddPzParentNode);
        } else if (2 == banCreateMaxPzNum) {
            //生成2个预制体
            this.createBan2PzData(bandAddPzParentNode);
        } else {
            //生成1个预制体
            this.createBan1PzData(bandAddPzParentNode);
        }
    }



    /**
     * 随机1个位置添加瓶子
     * @param addPzNode addNode
     */
    private createBan1PzData(addPzNode: Node) {
        const createIndex = MathUtil.randomBanPzNum(3);
        if (1 == createIndex) {
            //创建中间的瓶子
            this.createBanMiddlePz(addPzNode);
        } else if (2 == createIndex) {
            this.createBanLeftPz(addPzNode);
        } else {
            this.createBanRightPz(addPzNode);
        }
    }

    /**
     * 随机2个位置添加瓶子
     * @param addPzNode addNode
     */
    private createBan2PzData(addPzNode: Node) {
        const vacancyIndex = MathUtil.randomBanPzNum(3);
        if (1 == vacancyIndex) {
            //创建左 右
            this.createBanLeftPz(addPzNode);
            this.createBanRightPz(addPzNode);
        } else if (2 == vacancyIndex) {
            //创建中间, 右
            this.createBanMiddlePz(addPzNode);
            this.createBanRightPz(addPzNode);
        } else {
            //创建中间, 左
            this.createBanMiddlePz(addPzNode);
            this.createBanLeftPz(addPzNode);
        }
    }

    /**
     * 创建板子中间上的瓶子
     */
    private createBanMiddlePz(addPzNode: Node) {
        //实例化一个
        const middleNode = addPzNode.getChildByName("Middle");
        const randomIndex = Math.floor(Math.random() * this.pzArray.length);
        const randomPzType = this.pzArray[randomIndex];
        const pzPrefabName = "prefabs/game/pb" + PzEnumType[randomPzType];
        resources.load(pzPrefabName, Prefab, (error, preafab) => {
            if (error) {
                return;
            }
            const pzNode = instantiate(preafab);
            middleNode.addChild(pzNode);
        });
    }

    /**
     * 创建板子左边上的瓶子
     */
    private createBanLeftPz(addPzNode: Node) {
        //实例化一个
        const leftNode = addPzNode.getChildByName("Left");
        const randomIndex = Math.floor(Math.random() * this.pzArray.length);
        const randomPzType = this.pzArray[randomIndex];
        const pzPrefabName = "prefabs/game/pb" + PzEnumType[randomPzType];
        resources.load(pzPrefabName, Prefab, (error, preafab) => {
            if (error) {
                return;
            }
            const pzNode = instantiate(preafab);
            leftNode.addChild(pzNode);
        });
    }

    /**
    * 创建板子右边上的瓶子
    */
    private createBanRightPz(addPzNode: Node) {
        //实例化一个
        const rightNode = addPzNode.getChildByName("Right");
        const randomIndex = Math.floor(Math.random() * this.pzArray.length);
        const randomPzType = this.pzArray[randomIndex];
        const pzPrefabName = "prefabs/game/pb" + PzEnumType[randomPzType];
        resources.load(pzPrefabName, Prefab, (error, preafab) => {
            if (error) {
                return;
            }
            const pzNode = instantiate(preafab);
            rightNode.addChild(pzNode);
        });
    }


    backClick() {
        director.loadScene(DataConstant.SCENE_START);
    }

}

