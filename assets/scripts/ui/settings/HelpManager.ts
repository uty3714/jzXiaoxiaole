import { _decorator, Component, director, Node, Sprite, Animation, tween } from 'cc';
import DataConstant from '../../utils/DataConstant';
const { ccclass, property } = _decorator;

@ccclass('HelpManager')
export class HelpManager extends Component {

    backClick() {
        director.loadScene(DataConstant.SCENE_START);
    }
}

