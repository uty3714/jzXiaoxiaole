import { _decorator, Component, Node } from 'cc';
import EventManager from '../utils/EventManager';
import DataConstant from '../utils/DataConstant';
const { ccclass, property } = _decorator;

@ccclass('RenderManager')
export abstract class RenderManager extends Component {

    abstract render(): void

    protected onLoad(): void {
        EventManager.Instence.on(DataConstant.EVENT_UI_RENDER, this.render, this);
    }

    protected onDestroy(): void {
        EventManager.Instence.off(DataConstant.EVENT_UI_RENDER, this.render, this);
    }

}

