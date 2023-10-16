import { _decorator, CCFloat, Component, Label, Node, resources, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PbMainTopNode')
export class PbMainTopNode extends Component {

    @property(CCFloat) pbType: Number = 0;
    @property(Sprite) icon: Sprite = null;
    @property(Label) text: Label = null;

    protected onEnable(): void {
        if (this.pbType == 0) {
            this.loadCoinIcon();
        } else {
            this.loadHelathIcon();
        }
    }


    private loadCoinIcon() {
        //加载resources下的icon
        resources.load('images/main/game_coin/spriteFrame', SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            this.icon.spriteFrame = spriteFrame;
        });
    }

    private loadHelathIcon() {
        resources.load('images/main/game_health/spriteFrame', SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            this.icon.spriteFrame = spriteFrame;
        });
    }

    updateLabel(data: string) {
        this.text.string = data;
    }

}

