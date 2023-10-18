import { _decorator, CCInteger, Collider2D, director, Node } from 'cc';
import DataConstant from '../../utils/DataConstant';
import EventManager from '../../utils/EventManager';
import { RenderManager } from '../../base/RenderManager';
import GameManager from '../../base/GameManager';
import { PbMainTopNode } from '../PbMainTopNode';
import CreatePzUtil from '../../utils/CreatePzUtil';
import { CountdownNode } from '../CountdownNode';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends RenderManager {

    @property(Node) gamePanel: Node = null!;
    @property(Node) gameRewardPanel: Node = null!;

    @property(Node) gameBanNode: Node = null!;
    @property(Node) touchNode: Node = null!;
    @property(Node) topCoinsNode: Node = null!;
    @property(Node) topHealthNode: Node = null!;
    @property(Node) countDownNode: Node = null!;

    @property(CCInteger) gameLevel: number = 1;

    private _countDownLabel: CountdownNode = null;
    private _banMiddleNode: Node = null;
    private _banRightNode: Node = null;
    private _banLeftNode: Node = null;

    private _topCoinsScript: PbMainTopNode = null;
    private _topHealthScript: PbMainTopNode = null;

    //瓶子所有的类型
    private createPzTotal: number = 0;
    //碰撞的对象
    private firstColliderObject: number = -1;
    private colliderObject: Node[] = [];
    private colliderObjectUUID: string[] = [];

    private _callbackUseProps: Function = null;
    private _calbackTouchLineEnd: Function = null;
    private _callbackTouchLineStart: Function = null;
    private _callbackTouchBeginContact: Function = null;

    render(): void {
        console.log("game render", this);
        this.updateUserCoinHealth();
    }

    private updateUserCoinHealth() {
        const userCoins = GameManager.Instence.userCoins;
        const userHealth = GameManager.Instence.userHealth;
        this._topCoinsScript.updateText(userCoins + "");
        this._topHealthScript.updateText(userHealth + "");
    }

    protected onLoad(): void {
        super.onLoad();
        console.log("this.gameBanNode", this.gameBanNode);

        this._topCoinsScript = this.topCoinsNode.getComponent(PbMainTopNode);
        this._topHealthScript = this.topHealthNode.getComponent(PbMainTopNode);
        this._countDownLabel = this.countDownNode.getChildByName("ParentNode").
            getChildByName("CountDownLabel").getComponent(CountdownNode);
        this.updateUserCoinHealth();

        this._banMiddleNode = this.gameBanNode.getChildByName('pbBanMiddleNode');
        this._banLeftNode = this.gameBanNode.getChildByName('pbBanLeftNode');
        this._banRightNode = this.gameBanNode.getChildByName('pbBanRightNode');

        console.log("onLoad data: ", this._countDownLabel, this.gamePanel, this.gameRewardPanel, this.gameLevel);

        //生成随机瓶子
        this.initPz(false);

        //
        this.registerColliderCallback();
        this.registerDrawLineTouchStartCallback();
        this.registerDrawLineTouchEndCallback();
        //监听道具使用
        this.registerGamePropsUseCallback();
    }

    gameOver() {
        console.log("游戏结束");
        if (this.gamePanel != null) {
            this.gamePanel.active = false;
        }
        if (this.gameRewardPanel != null) {
            this.gameRewardPanel.active = true;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        console.log("game ---> destroy");

        EventManager.Instence.off(DataConstant.EVENT_GAME_PROPS_USE, this._callbackUseProps, this);
        EventManager.Instence.off(DataConstant.EVENT_TOUCH_LINE_END, this._calbackTouchLineEnd, this);
        EventManager.Instence.off(DataConstant.EVENT_TOUCH_LINE_START, this._callbackTouchLineStart, this);
        EventManager.Instence.off(DataConstant.EVENT_TOUCH_BEGIN_CONTACT, this._callbackTouchBeginContact, this);

    }

    private registerGamePropsUseCallback() {

        this._callbackUseProps = (propsType: number) => {
            console.log("触发了道具使用事件", propsType);
            switch (propsType) {
                case 1:
                    //使用了提示
                    break;
                case 2:
                    //使用了随机消除
                    break;
                case 3:
                    //使用了更换内容
                    console.log("callback:", this);
                    this.initPz(true);
                    break;
                case 4:
                    //使用了增加时间
                    if (this._countDownLabel != null) {
                        this._countDownLabel.addTime(30);
                    }
                    break;
                default:
                    break;
            }
        };


        EventManager.Instence.on(DataConstant.EVENT_GAME_PROPS_USE, this._callbackUseProps, this);
    }

    private registerDrawLineTouchEndCallback() {
        this._calbackTouchLineEnd = () => {
            console.log("触发了结束事件");
            this.destroyPzObject();
        };
        EventManager.Instence.on(DataConstant.EVENT_TOUCH_LINE_END, this._calbackTouchLineEnd, this);
    }

    //重置按下数据
    private registerDrawLineTouchStartCallback() {
        this._callbackTouchLineStart = () => {
            this.createPzTotal = CreatePzUtil.Instence.createPzTotalCount;
            console.log("总共还有: " + this.createPzTotal + "个瓶子");
            this.resetData();
            console.log("总共还有: ", this.colliderObject, "个碰撞缓存");
        };
        EventManager.Instence.on(DataConstant.EVENT_TOUCH_LINE_START, this._callbackTouchLineStart, this);
    }

    //监听碰撞
    private registerColliderCallback() {
        this._callbackTouchBeginContact = (otherCollider: Collider2D) => {
            console.log("game检测到碰撞: ", otherCollider.node.name, otherCollider.tag, otherCollider.node.uuid);
            if (-1 == this.firstColliderObject) {
                //记录 
                console.log("第一次碰撞");

                this.firstColliderObject = otherCollider.tag;
                this.recordTouchColliderNode(otherCollider);
            } else {
                if (this.colliderObjectUUID != null) {
                    const hasCollider = this.colliderObjectUUID.find((item) => {
                        return item == otherCollider.node.uuid;
                    })
                    if (hasCollider) {
                        console.log("找到了: 已经碰撞过了", hasCollider);
                    } else {
                        if (this.firstColliderObject == otherCollider.tag) {
                            this.recordTouchColliderNode(otherCollider);
                        } else {
                            console.log("碰撞失败");
                            this.resetData();
                            EventManager.Instence.emit(DataConstant.EVENT_BEGIN_CONTACT_FAIL);
                        }
                    }
                } else {
                    console.log(" this.colliderObjectUUID = null");

                }
            }
        }
        EventManager.Instence.on(DataConstant.EVENT_TOUCH_BEGIN_CONTACT,
            this._callbackTouchBeginContact, this);
    }

    private destroyPzObject() {
        const len = this.colliderObject.length;
        if (len > 1) {
            for (let i = 0; i < len; i++) {
                this.colliderObject[i].destroy();
            }
            this.createPzTotal -= len;
            CreatePzUtil.Instence.resetCreatePzTotal = this.createPzTotal;
            console.log("当前还剩: " + this.createPzTotal + "个瓶子");
            if (this.createPzTotal <= 0) {
                this.createPzTotal = 0;
                //游戏结束
                this.gameOver();
            }
        }
    }

    private recordTouchColliderNode(otherCollider: Collider2D) {
        //添加记录
        if (this.colliderObject != null) {
            this.colliderObject.push(otherCollider.node);
        }
        if (this.colliderObjectUUID != null) {
            this.colliderObjectUUID.push(otherCollider.node.uuid);
        }
    }

    private resetData() {
        this.firstColliderObject = -1;
        this.colliderObject = [];
        this.colliderObject.length = 0;
        this.colliderObjectUUID = [];
        this.colliderObjectUUID.length = 0;
    }


    private initPz(refresh: boolean = false) {
        console.log("init data: ", this, this._countDownLabel, this.gamePanel, this.gameRewardPanel, this.gameLevel);

        if (this._countDownLabel != null) {
            if (!this._countDownLabel.node.active) {
                this._countDownLabel.node.active = true;
            }
        }
        if (!refresh) {
            this._countDownLabel.restart();
        }
        if (this.gamePanel != null) {
            this.gamePanel.active = true;
        }
        if (this.gameRewardPanel != null) {
            this.gameRewardPanel.active = false;
        }
        EventManager.Instence.emit(DataConstant.EVENT_RESET_GAME_NODE);
        this.createPzTotal = 0;
        CreatePzUtil.Instence.resetCreatePzTotal = 0;
        this.resetData();
        if (1 == this.gameLevel) {
            const pzArray = [101, 102];
            //生成3个随机
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightNode, pzArray);
        }
    }




    backClick() {
        director.loadScene(DataConstant.SCENE_START);
    }

}

