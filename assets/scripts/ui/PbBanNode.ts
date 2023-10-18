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

    private _callback: Function = null;

    protected onLoad(): void {
        super.onLoad();
        this._callback = () => {
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
        };
        EventManager.Instence.on(DataConstant.EVENT_RESET_GAME_NODE, this._callback, this);

    }

    protected onDestroy(): void {
        super.onDestroy();
        EventManager.Instence.off(DataConstant.EVENT_RESET_GAME_NODE, this._callback, this);
    }

    render(): void {

    }

}

