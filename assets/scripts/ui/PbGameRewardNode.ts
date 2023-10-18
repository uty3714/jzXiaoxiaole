import { _decorator, CCInteger, Component, director, Label, Node, resources, Sprite, SpriteFrame, sys, tween, Vec3 } from 'cc';
import { MathUtil } from '../utils/MathUtil';
import DataConstant from '../utils/DataConstant';
import GameManager from '../base/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PbGameRewardNode')
export class PbGameRewardNode extends Component {
    @property(CCInteger) level: number = 0;
    @property(Node) rewardPropsNode: Node = null!;
    @property(Sprite) rewardProsSprite: Sprite = null!;
    @property(Label) rewardNum: Label = null!;

    private readonly _delayTime = 0.5;

    private _rewardType: number = 0;
    private _rewardRandomNum: number = 0;
    protected onEnable(): void {
        console.log("enable--->");

        //随机奖励
        this.randomReward();

        tween().target(this.rewardPropsNode)
            .to(this._delayTime, { scale: new Vec3(1.1, 1.1, 0) }, { easing: "linear" })
            .to(this._delayTime, { scale: new Vec3(1, 1, 0) }, { easing: 'linear' })
            .to(this._delayTime, { scale: new Vec3(0.9, 0.9, 0) }, { easing: 'linear' })
            .to(this._delayTime, { scale: new Vec3(1, 1, 0) }, { easing: 'linear' })
            .union()
            .repeatForever()
            .start();
    }


    protected onLoad(): void {

    }

    private randomReward() {
        this._rewardType = MathUtil.randomBanPzNum(2) + 2;
        this._rewardRandomNum = MathUtil.randomBanPzNum(2);

        const spriteName = "game_func" + this._rewardType;
        console.log("spriteName: " + spriteName);
        resources.load("images/main/" + spriteName + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return;
            }
            this.rewardProsSprite.spriteFrame = spriteFrame;

            console.log("随机奖励:", spriteName, this._rewardType, this._rewardRandomNum);

            this.rewardNum.string = "x" + this._rewardRandomNum.toString();
        });
    }


    nextLevelClick() {
        //记录到本地
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PASS_LEVEL, this.level.toString());
        //发送增加道具的方法
        switch (this._rewardType) {
            case 1:
                GameManager.Instence.addMorePropTips(this._rewardRandomNum);
                break;
            case 2:
                GameManager.Instence.addMorePropDestroyNode(this._rewardRandomNum);
                break;
            case 3:
                GameManager.Instence.addMorePropRandomNode(this._rewardRandomNum);
                break;
            case 4:
                GameManager.Instence.addMorePropAddTime(this._rewardRandomNum);
                break;
            default:
                break;
        }
        director.loadScene(DataConstant.SCENE_START);

    }

}

