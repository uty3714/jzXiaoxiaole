import { _decorator, AudioClip, AudioSource, CCInteger, Collider2D, director, Node, resources } from 'cc';
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
    @property(AudioSource) audioSource: AudioSource = null!;
    @property(CCInteger) gameLevel: number = 1;

    private _countDownLabel: CountdownNode = null;
    //第一关
    private _banMiddleNode: Node = null;
    private _banRightNode: Node = null;
    private _banLeftNode: Node = null;
    //第二关
    private _banMiddleCenterNode: Node = null;
    private _banRightCenterNode: Node = null;
    private _banLeftCenterNode: Node = null;
    //第三关
    private _banMiddleBottomNode: Node = null;
    private _banRightBottomNode: Node = null;
    private _banLeftBottomNode: Node = null;


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
        //声音
        this.audioSource = this.node.getComponent(AudioSource);
        this.audioSource.loop = true;
        this.audioSource.volume = GameManager.Instence.getCurrentAudioValue();

        this._topCoinsScript = this.topCoinsNode.getComponent(PbMainTopNode);
        this._topHealthScript = this.topHealthNode.getComponent(PbMainTopNode);
        this._countDownLabel = this.countDownNode.getChildByName("ParentNode").
            getChildByName("CountDownLabel").getComponent(CountdownNode);
        this.updateUserCoinHealth();

        this._banMiddleNode = this.gameBanNode.getChildByName('pbBanMiddleNode');
        this._banLeftNode = this.gameBanNode.getChildByName('pbBanLeftNode');
        this._banRightNode = this.gameBanNode.getChildByName('pbBanRightNode');
        if (this.gameLevel == 2) {
            this._banMiddleCenterNode = this.gameBanNode.getChildByName('pbBanMiddleCenterNode');
            this._banLeftCenterNode = this.gameBanNode.getChildByName('pbBanLeftCenterNode');
            this._banRightCenterNode = this.gameBanNode.getChildByName('pbBanRightCenterNode');
        }
        if (this.gameLevel == 3) {
            this._banMiddleCenterNode = this.gameBanNode.getChildByName('pbBanMiddleCenterNode');
            this._banLeftCenterNode = this.gameBanNode.getChildByName('pbBanLeftCenterNode');
            this._banRightCenterNode = this.gameBanNode.getChildByName('pbBanRightCenterNode');
            this._banMiddleBottomNode = this.gameBanNode.getChildByName('pbBanMiddleBottomNode');
            this._banLeftBottomNode = this.gameBanNode.getChildByName('pbBanLeftBottomNode');
            this._banRightBottomNode = this.gameBanNode.getChildByName('pbBanRightBottomNode');
        }
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
        this.audioSource.stop();

        resources.load("audio/win", AudioClip, (err, clip) => {
            if (err) {
                return;
            }
            console.log("load clip: 成功");
            this.audioSource.clip = clip;
            this.audioSource.loop = false;
            this.audioSource.play();
        });
        //this.audioSource.clip = 

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
        } else if (2 == this.gameLevel) {
            const pzArray = [101, 102, 201, 202, 301];
            //生成6个随机
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleCenterNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftCenterNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightCenterNode, pzArray);
        } else if (3 == this.gameLevel) {
            const pzArray = [101, 102, 103, 201, 202, 203, 301, 302];
            //生成9个随机
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleCenterNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftCenterNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightCenterNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banMiddleBottomNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banLeftBottomNode, pzArray);
            CreatePzUtil.Instence.createRandomPzData(this._banRightBottomNode, pzArray);
        }
    }




    backClick() {
        director.loadScene(DataConstant.SCENE_START);
    }

}

