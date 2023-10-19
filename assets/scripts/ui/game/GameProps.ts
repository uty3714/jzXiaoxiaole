import { _decorator, Button, CCInteger, Component, Label, Node, resources, Sprite, SpriteFrame } from 'cc';
import GameManager from '../../base/GameManager';
import EventManager from '../../utils/EventManager';
import DataConstant from '../../utils/DataConstant';
import { RenderManager } from '../../base/RenderManager';
const { ccclass, property } = _decorator;

@ccclass('GameProps')
export class GameProps extends RenderManager {

    @property(CCInteger) propsType: number = 0;
    @property(Sprite) propsSprite: Sprite = null;
    @property(Label) propsCountLabel: Label = null;

    private _propsCount: number = 0;

    protected onLoad(): void {
        super.onLoad();
        console.log("load props: " + this.propsType);

        switch (this.propsType) {
            case 1:
                this._propsCount = GameManager.Instence.propTipsNumber;
                break;
            case 2:
                this._propsCount = GameManager.Instence.propDestroyNodeNumber;
                break;
            case 3:
                this._propsCount = GameManager.Instence.propRandomNodeNumber;
                break;
            case 4:
                this._propsCount = GameManager.Instence.propAddTimeNumber;
                break;
            default:
                this._propsCount = 0;
                break;
        }
        this.propsCountLabel.string = this._propsCount.toString();
        this.loadSprite();
    }

    private loadSprite() {
        let spriteName = "game_func" + this.propsType;
        if (this._propsCount == 0) {
            spriteName = spriteName + "_disable";
        }
        resources.load("images/main/" + spriteName + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return;
            }
            this.propsSprite.spriteFrame = spriteFrame;
        });
    }

    propsClick() {
        if (this._propsCount > 0) {
            switch (this.propsType) {
                case 1:
                    GameManager.Instence.subMorePropTips(1);
                    break;
                case 2:
                    GameManager.Instence.subMorePropDestroyNode(1);
                    break;
                case 3:
                    GameManager.Instence.subMorePropRandomNode(1);
                    break;
                case 4:
                    GameManager.Instence.subMorePropAddTime(1);
                    break;
                default:
                    break;
            }
            EventManager.Instence.emit(DataConstant.EVENT_GAME_PROPS_USE, this.propsType);
            this._propsCount -= 1;
            this.propsCountLabel.string = this._propsCount.toString();
            if (this._propsCount == 0) {
                this.loadSprite();
            }

        }

    }

    render(): void {

    }


}

