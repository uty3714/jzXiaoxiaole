import { _decorator, Component, Node } from 'cc';
import EventManager from '../utils/EventManager';
import DataConstant from '../utils/DataConstant';
import { RenderManager } from '../base/RenderManager';
const { ccclass, property } = _decorator;

@ccclass('PbBanNode')
export class PbBanNode extends RenderManager {

    @property(Node) middleNode: Node = null!;
    @property(Node) leftNode: Node = null!;
    @property(Node) rightNode: Node = null!;


    protected onLoad(): void {
        super.onLoad();
        EventManager.Instence.on(DataConstant.EVENT_RESET_GAME_NODE, () => {
            console.log("重置prefab 节点， removeAll");

            if (this.middleNode != null) {
                this.middleNode.removeAllChildren();
            }
            if (this.leftNode != null) {
                this.leftNode.removeAllChildren();
            }
            if (this.rightNode != null) {
                this.rightNode.removeAllChildren();
            }
        }, this);

    }

    protected onDestroy(): void {
        super.onDestroy();
        EventManager.Instence.off(DataConstant.EVENT_RESET_GAME_NODE, () => {

        }, this);
    }

    render(): void {

    }

}

