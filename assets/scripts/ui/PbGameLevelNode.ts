import { _decorator, CCInteger, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PbGameLevelNode')
export class PbGameLevelNode extends Component {
    @property({ type: Sprite }) sprite: Sprite = null;
    @property({ type: CCInteger }) levelNum: number = 1;

    protected onLoad(): void {
        let spriteName = "game_level" + this.levelNum;
        resources.load("images/main/" + spriteName + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return;
            }
            this.sprite.spriteFrame = spriteFrame;
        });
    }

}

